const { usersCollection } = require("../db");

exports.signUp = async (req, res) => {
  try {
    const { email, username, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      res.status(401).send("Passwords Do not match");
      return;
    }

    await usersCollection.insertOne({
      email,
      username,
      password,
    });

    res.status(201).redirect("/");
  } catch (error) {
    console.error(`Error in /submit route: ${error}`);
    res.status(500).send(`Internal Server Error`);
  }
};
