const { usersCollection } = require("../db");

exports.logIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await usersCollection.findOne({ username: username });
    if (!user) {
      res.status(404).send("User Not Found!");
      return;
    }

    if (user.password === password) {
      res.status(200).render("home");
    } else {
      res.status(404).send("Wrong Password");
    }
  } catch (error) {
    console.log(`Error in /login route: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};
