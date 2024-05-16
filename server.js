const express = require("express");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const { connectToDB } = require("./db");
const userRoutes = require("./server/routes/userRoutes");
const adminRoutes = require("./server/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the Database
connectToDB();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/logout", (req, res) => {
  res.redirect("/api/user/");
});

app.get("/api/admin/", (req, res) => {
  res.status(200).render("adminLogin");
});

app.use("/", userRoutes);
app.use("/", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`);
});
