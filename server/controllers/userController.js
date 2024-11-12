import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUsersCollection } from "../config/db.js";

const loginPage = (req, res) => {
  res.status(200).render("user/userSignIn");
};

const signupPage = (req, res) => {
  res.status(200).render("user/userSignup");
};

const about = (req, res) => {
  res.status(200).render("user/about");
};

const homePage = (req, res) => {
  const user = req.user;
  res.status(200).render("user/home", {
    firstName: user.firstName,
    lastName: user.lastName,
  });
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUsersCollection.findOne({ email: email });
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

const userSignup = async (req, res) => {
  const { firstName, lastName, tel, email, password, passwordConfirm } =
    req.body;

  try {
    if (password !== passwordConfirm)
      return res.status(401).send("Passwords Do not match");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await getUsersCollection.insertOne({
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

const userLogout = async (req, res) => {
  // Clear JWT token cookie
  res.clearCookie("accessToken").redirect("/api/user/");
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export {
  loginPage,
  signupPage,
  about,
  homePage,
  userLogin,
  userSignup,
  userLogout,
};
