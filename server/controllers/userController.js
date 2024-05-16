const { usersCollection } = require("../../db");
const bcrypt = require("bcrypt");

exports.loginPage = (req, res) => {
  res.status(200).render("userLogin");
};

exports.signupPage = (req, res) => {
  res.status(200).render("userSignup");
};

exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersCollection.findOne({ username: username });
    if (!user) {
      return res.status(400).send("User Not Found!");
    }
    if (await bcrypt.compare(password, user.password)) {
      res.status(200).render("home");
    } else {
      return res.status(404).send("Wrong Password");
    }
  } catch (error) {
    console.log(`Error in /login route: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

exports.userSignup = async (req, res) => {
  try {
    const { email, username, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      res.status(401).send("Passwords Do not match");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).redirect("/api/user/");
  } catch (error) {
    console.error(`Error in /submit route: ${error}`);
    res.status(500).send(`Internal Server Error`);
  }
};
