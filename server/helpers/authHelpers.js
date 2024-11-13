import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const comparePasswords = async (password, hashedPassword) =>
  await bcrypt.compare(password, hashedPassword);

const hashedPassword = async (password) => await bcrypt.hash(password, 12);

const generateAccessToken = async (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

const setCookies = async (res, user) => {
  try {
    const accessToken = await generateAccessToken(user);
    if (!accessToken) throw new Error("Failed to generate access token");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  } catch (error) {
    console.error("Error setting cookies:", error);
    throw error;
  }
};

const clearCookies = async (res) => {
  try {
    res.clearCookie("accessToken");
    return true;
  } catch (error) {
    console.error("Error clearing cookies:", error);
    throw error;
  }
};

export {
  comparePasswords,
  hashedPassword,
  generateAccessToken,
  setCookies,
  clearCookies,
};
