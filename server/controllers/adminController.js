import { getUsersCollection } from "../config/db.js";
import {
  createUser,
  deleteUserData,
  findUserByCredentials,
  findUserByUsername,
  findUsersByFilter,
  findUsersBySearchCriteria,
  findUsersCount,
  updateUserData,
} from "../services/userServices.js";

const locals = {
  description: "Nodejs USER Management System",
};

/**
 * Handle rendering the dashboard page.
 * Displays a list of users with pagination.
 * @route GET /api/admin/dashboard
 */

export const renderDashboardPage = async (req, res) => {
  locals.title = "Admin Dashboard - Node.js";
  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const users = await findUsersByFilter(page, perPage);
    const usersCount = await findUsersCount();
    const pages = Math.ceil(usersCount / perPage);

    res.status(200).render("admin/dashboard", {
      locals,
      users,
      current: page,
      pages,
    });
  } catch (error) {
    console.error(`Error rendering dashboard page: ${error}`);
    throw error;
  }
};

/**
 * Handle rendering the About page.
 * Displays information about the Node.js app.
 * @route GET /api/admin/dashboard/about
 */
export const renderAboutPage = async (req, res) => {
  locals.title = "About - Node.js";

  try {
    res.status(200).render("admin/about", locals);
  } catch (error) {
    console.error(`Error rendering about page: ${error}`);
    throw error;
  }
};

/*
 * Handle displaying user details.
 * Displays the details of a specific user based on username.
 * @route GET /api/admin/dashboard/view/:username
 */
export const renderUserDetails = async (req, res) => {
  const { username } = req.params;
  locals.title = "View User - Node.js";

  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(404).render("admin/404");

    return res.status(200).render("admin/viewUser", { locals, user });
  } catch (error) {
    console.error(`Error rendering user details: ${error}`);
    throw error;
  }
};

/*
 * Handle creating a new user.
 * Adds a new user to the database and returns success response.
 * @route POST /api/admin/dashboard/postUser
 */
export const handleAddUser = async (req, res) => {
  const { username, email, tel, role } = req.body;

  try {
    const userData = {
      username,
      email,
      tel,
      role: {
        id: role === "ADMIN" ? 1 : 2,
        name: role,
      },
    };

    // Find existing user
    const user = await findUserByCredentials(username, email, tel);
    if (user)
      return res.status(400).json({ success: false, message: "User Exists" });

    // Create user
    const result = await createUser(userData);
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
    console.error(`Error Adding User: ${error}`);
    throw error;
  }
};

/*
 * Handle updating a user's details.
 * Updates the user information in the database.
 * @route PUT /api/admin/dashboard/view/update/:username
 */

export const handleUpdateUser = async (req, res) => {
  const { username } = req.params;
  const { email, tel, role } = req.body;

  try {
    const updateData = {
      username: req.body.username || username,
      email,
      tel: Number(tel),
      role: {
        id: role === "ADMIN" ? 1 : 2,
        name: role,
      },
    };

    const { modifiedCount } = await updateUserData(username, updateData);
    if (!modifiedCount)
      return res
        .status(500)
        .json({ success: false, message: "Error Updating User" });

    return res.status(200).json({
      success: true,
      message: "User Updated",
      data: updateData.username,
    });
  } catch (error) {
    console.error(`Error Updating User: ${error}`);
    throw error;
  }
};

/*
 * Handle deleting a user.
 * Removes the user from the database based on username.
 * @route DELETE /api/admin/dashboard/view/delete/:username
 */

export const handleDeleteUser = async (req, res) => {
  const { username } = req.params;

  try {
    const { deletedCount } = await deleteUserData(username);
    if (!deletedCount)
      return res
        .status(500)
        .json({ success: false, message: "Error Deleting User" });

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error Deleting User: ${error}`);
    throw error;
  }
};

/*
 * Handle searching for a user.
 * Searches for users based on the search term.
 * @route POST /api/admin/dashboard/searchUser
 */

export const handleSearchUser = async (req, res) => {
  const { searchTerm } = req.body;
  locals.title = "Search User - Node.js";

  try {
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const searchCriteria = new RegExp(searchNoSpecialChar, "i");

    const users = await findUsersBySearchCriteria(searchCriteria);

    res.render("admin/searchUser", { locals, users });
  } catch (error) {
    console.error(`Error searching for user(s): ${error}`);
    res.status(500).json({ message: "Internal server error" });
    throw error;
  }
};
