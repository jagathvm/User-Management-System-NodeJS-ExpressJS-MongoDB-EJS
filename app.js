const express = require("express");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const { connectToDB } = require("./server/config/db");
const userRoutes = require("./server/routes/userRoutes");
const adminRoutes = require("./server/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT;

// Connect to the Database
connectToDB();

// Templating Engine
app.set("view engine", "ejs");

// Express Layout
app.use(expressLayout);
app.use((req, res, next) => {
  if (req.path.startsWith("/api/admin/dashboard")) {
    app.set("layout", "./layouts/main");
  } else {
    app.set("layout", false);
  }
  next();
});

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User and Admin Routes
app.use("/", userRoutes);
app.use("/", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`);
});
