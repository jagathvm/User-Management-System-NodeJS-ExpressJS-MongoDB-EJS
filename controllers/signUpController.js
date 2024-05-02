const { usersCollection } = require("../db");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
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

    res.status(201).redirect("/");
  } catch (error) {
    console.error(`Error in /submit route: ${error}`);
    res.status(500).send(`Internal Server Error`);
  }
};
