const { usersCollection } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginPage = (req, res) => {
  res.status(200).render("user/userSignIn");
};

exports.signupPage = (req, res) => {
  res.status(200).render("user/userSignup");
};

exports.about = (req, res) => {
  res.status(200).render("user/about");
};

exports.homePage = (req, res) => {
  const user = req.user;
  console.log(user.firstName, user.lastName);
  res.status(200).render("user/home", {
    firstName: user.firstName,
    lastName: user.lastName,
  });
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return res.status(400).send("User Not Found!");
    }
    if (await bcrypt.compare(password, user.password)) {
      // Generate JWT Token
      const accessToken = generateAccessToken(user);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).redirect("/api/user/home");
    } else {
      return res.status(404).send("Wrong Password");
    }
  } catch (error) {
    console.log(`Error in /login route: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

exports.userSignup = async (req, res) => {
  const { firstName, lastName, tel, email, password, passwordConfirm } =
    req.body;

  if (password !== passwordConfirm) {
    res.status(401).send("Passwords Do not match");
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await usersCollection.insertOne({
      firstName,
      lastName,
      tel,
      email,
      password: hashedPassword,
    });

    res.status(201).redirect("/api/user/");
  } catch (error) {
    console.error(`Error in /submit route: ${error}`);
    res.status(500).send(`Internal Server Error`);
  }
};

exports.userLogout = async (req, res) => {
  // Clear JWT token cookie
  res.clearCookie("accessToken").redirect("/api/user/");
};

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}
