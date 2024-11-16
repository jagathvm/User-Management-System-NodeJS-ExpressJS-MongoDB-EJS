import app from "../../app.js";

export const setLayout = (req, res, next) => {
  if (req.path.startsWith("/api/admin/dashboard")) {
    app.set("layout", "./layouts/main");
  } else {
    app.set("layout", false);
  }
  next();
};
