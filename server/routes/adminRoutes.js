import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { noCache } from "../middlewares/noCache.js";
import * as adminController from "../controllers/adminController.js";

const router = Router();

// Middleware for no-cache and authentication
router.use(noCache, authenticateToken);

// Admin Dashboard Routes

/**
 * @route   GET /dashboard
 * @desc    Render admin dashboard
 */
router.get("/dashboard", adminController.renderDashboardPage);

/**
 * @route   GET /dashboard/about
 * @desc    Render admin about page
 */
router.get("/dashboard/about", adminController.renderAboutPage);

/**
 * @route   GET /dashboard/addUser
 * @desc    Render add user form
 */
router.get("/dashboard/addUser", adminController.renderAddUserForm);

/**
 * @route   GET /dashboard/view/:username
 * @desc    View user details
 */
router.get("/dashboard/view/:username", adminController.renderUserDetails);

/**
 * @route   POST /dashboard/postUser
 * @desc    Handle adding a new user
 */
router.post("/dashboard/postUser", adminController.handleAddUser);

/**
 * @route   POST /dashboard/searchUser
 * @desc    Handle user search
 */
router.post("/dashboard/searchUser", adminController.handleSearchUser);

/**
 * @route   PUT /dashboard/view/update/:username
 * @desc    Handle user update
 */
router.put(
  "/dashboard/view/update/:username",
  adminController.handleUpdateUser
);

/**
 * @route   DELETE /dashboard/view/delete/:username
 * @desc    Handle user deletion
 */
router.delete(
  "/dashboard/view/delete/:username",
  adminController.handleDeleteUser
);

export default router;
