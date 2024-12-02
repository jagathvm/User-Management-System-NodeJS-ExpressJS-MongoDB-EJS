import app from "../../app.js";

export const setLayout = (req, res, next) => {
  if (req.path.startsWith("/api/admin")) {
    app.set("layout", "./layouts/admin");
  } else {
    app.set("layout", "./layouts/user");
  }
  next();
};
