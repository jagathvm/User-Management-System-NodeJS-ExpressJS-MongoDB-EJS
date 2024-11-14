import jwt from "jsonwebtoken";
import { getUsersCollection } from "../config/db.js";
import { clearCookies } from "../helpers/authHelpers.js";

const locals = {
  description: "Nodejs USER Management System",
};

/*
 * GET /api/admin/dashboard
 * dashboard
 */

const dashboard = async (req, res) => {
  locals.title = "Admin Dashboard - Node.js";
  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const users = await getUsersCollection
      .find()
      .sort({ firstName: 1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .toArray();

    const usersCount = await getUsersCollection.countDocuments();

    res.status(200).render("admin/dashboard", {
      locals,
      users,
      current: page,
      pages: Math.ceil(usersCount / perPage),
    });
  } catch (error) {
    console.error(error);
  }
};

/*
 * GET /api/admin/dashboard/about
 * About
 */

const about = async (req, res) => {
  locals.title = "About - Node.js";

  try {
    res.status(200).render("admin/about", locals);
  } catch (error) {
    console.error(error);
  }
};

/*
 * GET /api/admin/dashboard/addUser
 * New User Form
 */

const addUser = async (req, res) => {
  locals.title = "Add New User - Node.js";
  res.status(200).render("admin/addUser", { locals });
};

/*
 * POST /api/admin/dashboard/postUser
 * Create New User
 */

const postUser = async (req, res) => {
  const { username, email, tel, role } = req.body;

  try {
    const userData = {
      username,
      email,
      tel: Number(tel),
      role: {
        id: role === "ADMIN" ? 1 : 2,
        name: role,
      },
    };
    const result = await getUsersCollection.insertOne(userData);

    if (!result)
      return res
        .status(500)
        .json({ success: false, message: "Error Adding User" });

    return res.status(200).json({
      success: false,
      message: "User Added Successfully",
      data: username,
    });
  } catch (error) {
    console.error(error);
  }
};

/*
 * GET /api/admin/dashboard/view/:id
 * View User
 */

const viewUser = async (req, res) => {
  const { username } = req.params;
  locals.title = "View User - Node.js";

  try {
    const user = await getUsersCollection.findOne({ username });

    if (!user) return res.status(404).render("admin/404");
    return res.status(200).render("admin/viewUser", { locals, user });
  } catch (error) {
    console.error(error);
  }
};

/*
 * GET /api/admin/dashboard/edit/:id
 * Edit User Page
 */

const editUser = async (req, res) => {
  const { username } = req.params;
  locals.title = "Edit User - Node.js";

  try {
    const user = await getUsersCollection.findOne({ username });

    res.status(200).render("admin/editUser", { locals, user });
  } catch (error) {
    console.error(error);
  }
};

/*
 * PUT /api/admin/dashboard/edit/:id
 * Update User
 */

const updateUser = async (req, res) => {
  const { username } = req.params;
  const { email, tel, role } = req.body;

  try {
    const updateData = {
      username: req.body.username,
      email,
      tel: Number(tel),
      role: {
        id: role === "ADMIN" ? 1 : 2,
        name: role,
      },
    };

    const { modifiedCount } = await getUsersCollection.updateOne(
      { username },
      { $set: updateData }
    );

    if (!modifiedCount)
      return res
        .status(500)
        .json({ success: false, message: "Error updating user" });

    return res.status(200).json({
      success: true,
      message: "User Updated",
      data: req.body.username,
    });
  } catch (error) {
    console.error(`Error Updating User: ${error}`);
  }
};

/*
 * Delete /api/admin/dashboard/edit/:id
 * Delete User
 */

const deleteUser = async (req, res) => {
  const { username } = req.params;

  try {
    const { deletedCount } = await getUsersCollection.deleteOne({ username });

    if (!deletedCount)
      return res
        .status(500)
        .json({ success: false, message: "Error Deleting User" });

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error Deleting User: ${error}`);
  }
};

/*
 * Post /api/admin/dashboard/searchUser
 * Search User
 */

const searchUser = async (req, res) => {
  const { searchTerm } = req.body;
  locals.title = "Search User - Node.js";

  try {
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const searchCriteria = new RegExp(searchNoSpecialChar, "i");

    const users = await getUsersCollection
      .find({
        $or: [
          { username: searchCriteria },
          { email: searchCriteria },
          { tel: searchCriteria },
        ],
      })
      .toArray();

    res.render("admin/searchUser", { locals, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogout = async (req, res) => {
  try {
    // Clear JWT token cookie
    await clearCookies(res);

    // Redirect to login page
    res.redirect("/api/user/");
  } catch (error) {
    console.error(`Error in /logout route: ${error}`);
    res
      .status(500)
      .send("Something went wrong. Please logout after some time.");
  }
};

function generateAccessToken(admin) {
  return jwt.sign(admin, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

export {
  dashboard,
  about,
  addUser,
  postUser,
  viewUser,
  editUser,
  updateUser,
  deleteUser,
  searchUser,
  adminLogout,
};
