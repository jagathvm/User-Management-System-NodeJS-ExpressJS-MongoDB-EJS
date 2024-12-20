import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { noCache } from "../middlewares/noCache.js";
import * as adminController from "../controllers/adminController.js";

const router = Router();

// Middleware for no-cache and authentication
router.use(noCache, authenticateToken);

// ====== Admin Dashboard Routes ====== //

/**
 * @route   GET /dashboard
 * @desc    Render the admin dashboard
 * @access  Protected
 */
router.get("/dashboard", adminController.renderDashboardPage);

/**
 * @route   GET /dashboard/about
 * @desc    Render the admin about page
 * @access  Protected
 */
router.get("/about", adminController.renderAboutPage);

/**
 * @route   GET /dashboard/view/:username
 * @desc    View the details of a user
 * @access  Protected
 */
router.get("/dashboard/view/:username", adminController.renderUserDetails);

/**
 * @route   POST /dashboard/postUser
 * @desc    Handle the addition of a new user
 * @access  Protected
 */
router.post("/dashboard/postUser", adminController.handleAddUser);

/**
 * @route   PUT /dashboard/view/update/:username
 * @desc    Handle the update of user details
 * @access  Protected
 */
router.put(
  "/dashboard/view/update/:username",
  adminController.handleUpdateUser
);

/**
 * @route   PUT /dashboard/view/block/:username
 * @desc    Handle the blocking/unblocking of a user
 * @access  Protected
 */
router.put(
  "/dashboard/view/block/:username",
  adminController.handleBlockOrUnblockUser
);

/**
 * @route   DELETE /dashboard/view/delete/:username
 * @desc    Handle the deletion of a user
 * @access  Protected
 */
router.delete(
  "/dashboard/view/delete/:username",
  adminController.handleDeleteUser
);

export default router;
