import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // Get the JWT token from the request cookies
  const { accessToken } = req.cookies;
  if (!accessToken) {
    if (req.originalUrl.startsWith("/api/user")) {
      return res.status(404).redirect("/api/user/404");
    }
    return res.render("admin/404", { req });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (req.originalUrl.startsWith("/api/user"))
        return res.render("user/404", { req });
      return res.render("admin/404", { req });
    }
    req.user = user;
    next();
  });
};
