const { usersCollection } = require("../db");
const bcrypt = require("bcrypt");

exports.logIn = async (req, res) => {
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
