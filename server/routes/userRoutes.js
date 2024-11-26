import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { noCache } from "../middlewares/noCache.js";
import * as userController from "../controllers/userController.js";

const router = Router();

// Apply noCache middleware to all routes
router.use(noCache);

// ====== Public Routes ====== //
/**
 * @route   GET /
 * @desc    Render the login page
 * @access  Public
 */
router.get("/", userController.renderLoginPage);

/**
 * @route   GET /signup
 * @desc    Render the signup page
 * @access  Public
 */
router.get("/signup", userController.renderSignupPage);

/**
 * @route   POST /
 * @desc    Handle user login
 * @access  Public
 */
router.post("/", userController.handleUserLogin);

/**
 * @route   POST /signup
 * @desc    Handle user registration
 * @access  Public
 */
router.post("/signup", userController.handleUserSignup);

// ====== Protected Routes ====== //

// Apply authentication middleware to all protected routes
router.use(authenticateToken);

/**
 * @route   GET /home
 * @desc    Render the home page
 * @access  Protected
 */
router.get("/home", userController.renderHomePage);

/**
 * @route   GET /about
 * @desc    Render the about page
 * @access  Protected
 */
router.get("/about", userController.renderAboutPage);

/**
 * @route   GET /logout
 * @desc    Log out the user and clear cookies
 * @access  Public
 */
router.get("/logout", userController.handleUserLogout);

export default router;
