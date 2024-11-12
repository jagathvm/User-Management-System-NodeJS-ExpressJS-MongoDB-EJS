import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";

import { connectToDB } from "./server/config/db.js";

// Routes
import userRoutes from "./server/routes/userRoutes.js";
import adminRoutes from "./server/routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the Database
connectToDB();

// Templating Engine
app.set("view engine", "ejs");

// Express Layout
app.use(expressEjsLayouts);
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
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// User and Admin Routes
app.use("/", userRoutes);
app.use("/", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`);
});

export default app;
