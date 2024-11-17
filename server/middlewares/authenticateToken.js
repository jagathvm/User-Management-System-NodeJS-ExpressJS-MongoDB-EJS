import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // Get the JWT token from the request cookies
  const { accessToken } = req.cookies;
  if (!accessToken)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, message: "Forbidden" });
    req.user = user;
    next();
  });
};
