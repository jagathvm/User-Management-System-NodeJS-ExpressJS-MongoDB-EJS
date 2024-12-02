import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserById } from "../services/userServices.js";

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

export const handleFetchUserFromRequest = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await findUserById(id);
    if (!user) return res.status(404).redirect("/api/user/404");

    const {
      username,
      role: { id: roleId },
    } = user;

    return { username, roleId };
  } catch (error) {
    console.log(error);
  }
};

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

export const formatDateToISOString = (date) => date.toISOString();

export const formatDateToLocaleString = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour clock (AM/PM)
  };

  return new Date(date).toLocaleString("en-IN", options);
};

export const sanitizeQuery = (queryParams) => {
  const { searchUser, sort, role, status, page } = queryParams;

  // Initialize default values for limit, filter, and sort
  const limit = 5;
  const filter = {};
  const sortObject = {};

  // Handle searchUser (case-insensitive search on username or other fields)
  if (searchUser) {
    filter.username = { $regex: searchUser, $options: "i" };
  }

  // Handle role filter
  if (role) {
    filter["role.id"] = role === "admin" ? 1 : 2;
  }

  // Handle status filter
  if (status === "active" || status === "inactive") {
    filter["accountStatus.isActive"] = status === "active";
  }

  if (status === "blocked") {
    filter["accountStatus.isBlocked"] = true;
  }

  if (sort) {
    // Handle sort options
    const sortFields = {
      usernameAsc: { username: 1 },
      usernameDesc: { username: -1 },
      createdAtAsc: { "accountStatus.createdAt": 1 },
      createdAtDesc: { "accountStatus.createdAt": -1 },
    };
    // Default to empty sort if invalid
    Object.assign(sortObject, sortFields[sort] || { username: 1 });
  }

  // Check if the sortObject is empty, and set the default sort if it is
  if (Object.keys(sortObject).length === 0) {
    // Default sort by createdAt descending
    sortObject["accountStatus.createdAt"] = -1;
  }

  return { filter, sort: sortObject, limit, page: parseInt(page) || 1 };
};
