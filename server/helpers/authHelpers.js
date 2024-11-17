import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePasswords = async (password, hashedPassword) => {
  try {
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    return passwordsMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};

export const hashedPassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    return passwordHash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

const generateAccessToken = async (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

export const setCookies = async (res, userId) => {
  try {
    const accessToken = await generateAccessToken({ id: userId });
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

export const clearCookies = async (res) => {
  try {
    res.clearCookie("accessToken");
    return true;
  } catch (error) {
    console.error("Error clearing cookies:", error);
    throw error;
  }
};
