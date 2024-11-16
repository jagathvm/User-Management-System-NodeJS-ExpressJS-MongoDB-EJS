import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // Get the JWT token from the request cookies
  const { accessToken } = req.cookies;
  if (!accessToken) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
