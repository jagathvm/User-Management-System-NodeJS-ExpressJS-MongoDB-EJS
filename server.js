const express = require("express");
const path = require("path");
const { connectToDB } = require("./db");
const logInRoutes = require("./routes/logInRoutes");
const signUpRoutes = require("./routes/signUpRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the Database
connectToDB();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).render("login");
});

app.get("/signup", (req, res) => {
  res.status(200).render("signup");
});

app.use("/", logInRoutes);
app.use("/signup", signUpRoutes);

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`);
});
