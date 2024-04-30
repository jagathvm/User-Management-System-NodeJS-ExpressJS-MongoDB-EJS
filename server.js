const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config(".env");

const app = express();
const PORT = process.env.PORT || 3000;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error(`Error connecting to MongoDB: ${err}`);
    process.exit(1);
  }
  console.log(`Connected to MongoDB`);
});

const db = client.db("CRUD_Project");
const usersCollection = db.collection("users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "styles")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
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
      res.status(401).send("Passwords do not match");
    }
  } catch (error) {
    console.log(`Error in /login route: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/submit", async (req, res) => {
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

    res.status(201).render("login");
  } catch (error) {
    console.error(`Error in /submit route: ${error}`);
    res.status(500).send(`Internal Server Error`);
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`);
});
