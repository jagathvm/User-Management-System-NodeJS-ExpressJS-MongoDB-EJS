const express = require("express");
const path = require("path");
const { connectToDB } = require("./db");
const userRoutes = require("./server/routes/userRoutes");
const adminRoutes = require("./server/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the Database
connectToDB();

// Templating Engine
app.set("view engine", "ejs");

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/admin/", (req, res) => {
  res.status(200).render("adminLogin");
});

app.use("/", userRoutes);
app.use("/", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`);
});
