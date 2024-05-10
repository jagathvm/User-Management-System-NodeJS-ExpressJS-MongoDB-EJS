const { adminCollection } = require("../../db");
const bcrypt = require("bcrypt");

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const admin = await adminCollection.findOne({
      username: username,
    });
    if (!admin) {
      return res.status(400).send("Admin Not Found!");
    }
    if (await bcrypt.compare(password, admin.password)) {
      res.status(200).render("home");
    } else {
      return res.status(404).send("Wrong Password");
    }
  } catch (error) {
    console.log(`Error in /admin/ route: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};
