const { usersCollection } = require("../config/db");

const bcrypt = require("bcrypt");

exports.loginPage = (req, res) => {
  res.status(200).render("user/userSignIn");
};

exports.signupPage = (req, res) => {
  res.status(200).render("user/userSignup");
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return res.status(400).send("User Not Found!");
    }
    if (await bcrypt.compare(password, user.password)) {
      res.status(200).render("user/home", {
        firstName: user.firstName,
        lastName: user.lastName,
      });
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

    console.log(user);
    res.status(201).redirect("/api/user/");
  } catch (error) {
    console.error(`Error in /submit route: ${error}`);
    res.status(500).send(`Internal Server Error`);
  }
};

exports.userLogout = async (req, res) => {
  res.redirect("/api/user/");
};
