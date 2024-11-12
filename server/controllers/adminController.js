import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getAdminCollection, getUsersCollection } from "../config/db.js";

/*
 * GET /api/admin/
 * Sign In
 */

const adminSignInPage = async (req, res) => {
  try {
    res.status(200).render("admin/adminSignIn");
  } catch (error) {
    console.log(error);
  }
};

/*
 * POST /api/admin/
 * Sign In
 */

const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await getAdminCollection.findOne({
      email,
    });

    if (!admin) {
      return res.status(400).send("Admin Not Found!");
    }
    if (await bcrypt.compare(password, admin.password)) {
      // Generate JWT Token
      const accessToken = generateAccessToken(admin);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).redirect("/api/admin/dashboard");
    } else {
      return res.status(404).send("Wrong Password");
    }
  } catch (error) {
    console.log(`Error in /admin/ route: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

/*
 * GET /api/admin/dashboard
 * dashboard
 */

const dashboard = async (req, res) => {
  const locals = {
    title: "Admin Dashboard - Node.js",
    description: "Nodejs USER Management System",
  };

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
  const locals = {
    title: "About - Node.js",
    description: "Nodejs USER Management System",
  };

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
  const locals = {
    title: "Add New User - Node.js",
    description: "Nodejs USER Management System",
  };
  res.status(200).render("admin/addUser", { locals });
};

/*
 * POST /api/admin/dashboard/postUser
 * Create New User
 */

const postUser = async (req, res) => {
  try {
    const { firstName, lastName, email, tel } = req.body;

    const result = await getUsersCollection.insertOne({
      firstName,
      lastName,
      email,
      tel,
    });

    if (result) {
      res.status(200).redirect("/api/admin/dashboard");
    } else {
      res.status(500).json({ message: "Error Adding User" });
    }
  } catch (error) {
    console.error(error);
  }
};

/*
 * GET /api/admin/dashboard/view/:id
 * View User
 */

const viewUser = async (req, res) => {
  const locals = {
    title: "View User - Node.js",
    description: "Nodejs USER Management System",
  };

  try {
    const user = await getUsersCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).render("admin/viewUser", { locals, user });
  } catch (error) {
    console.error(error);
  }
};

/*
 * GET /api/admin/dashboard/edit/:id
 * Edit User Page
 */

const editUser = async (req, res) => {
  const userId = req.params.id;
  const locals = {
    title: "Edit User - Node.js",
    description: "Nodejs USER Management System",
  };

  try {
    const user = await getUsersCollection.findOne({
      _id: new ObjectId(userId),
    });

    res.status(200).render("admin/editUser", { locals, user });
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/api/admin/dashboard");
  }
};

/*
 * PUT /api/admin/dashboard/edit/:id
 * Update User
 */

const updateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      tel: req.body.tel,
    };

    await getUsersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
  } catch (error) {
    console.error(`Error Updating User: ${error}`);
    res.status(500).redirect(`/api/admin/dashboard/edit/${userId}`);
  } finally {
    res.json({ message: "User Details Updated." });
  }
};

/*
 * Delete /api/admin/dashboard/edit/:id
 * Delete User
 */

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await getUsersCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    res.status(200).redirect("/api/admin/dashboard");
    // res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error Deleting User: ${error}`);
    res.status(500).redirect("/api/admin/dashboard");
  }
};

/*
 * Post /api/admin/dashboard/searchUser
 * Search User
 */

const searchUser = async (req, res) => {
  const locals = {
    title: "Search User - Node.js",
    description: "Nodejs USER Management System",
  };
  try {
    const searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const users = await getUsersCollection
      .find({
        $or: [
          { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
          { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
          {
            tel: {
              $regex: new RegExp(
                `^[\\d\\s\\-()\\+]*${searchNoSpecialChar}[\\d\\s\\-()\\+]*$`,
                "i"
              ),
            },
          },
        ],
      })
      .toArray();

    // console.log(users);

    res.render("admin/searchUser", { locals, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogout = async (req, res) => {
  // Clear JWT token cookie
  res.clearCookie("accessToken").redirect("/api/admin/");
};

function generateAccessToken(admin) {
  return jwt.sign(admin, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

export {
  adminSignIn,
  adminSignInPage,
  dashboard,
  about,
  addUserPage,
  addUser,
  postUser,
  viewUser,
  editUser,
  updateUser,
  deleteUser,
  searchUser,
  adminLogout,
};
