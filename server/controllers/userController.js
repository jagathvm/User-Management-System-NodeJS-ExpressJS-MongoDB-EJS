import {
  createUser,
  findUserByCredentials,
  findUserByEmail,
  findUserById,
} from "../services/userServices.js";
import {
  comparePasswords,
  clearCookies,
  setCookies,
} from "../helpers/authHelpers.js";

// ===== Render Pages ===== //

/**
 * Render the login page.
 * @route GET /api/user/login
 */
export const renderLoginPage = (req, res) => {
  res.status(200).render("user/userSignIn");
};

/**
 * Render the signup page.
 * @route GET /api/user/signup
 */
export const renderSignupPage = (req, res) => {
  res.status(200).render("user/userSignup");
};

/**
 * Render the about page.
 * @route GET /api/user/about
 */
export const renderAboutPage = (req, res) => {
  res.status(200).render("user/about");
};

/**
 * Render the home page.
 * Retrieves the username from the database based on the authenticated user's ID.
 * @route GET /api/user/home
 * @param {Object} req.user - User object from authentication middleware.
 */
export const renderHomePage = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await findUserById(id);
    if (!user) return res.status(404).render("user/404");

    const { username } = user;
    res.status(200).render("user/home", {
      username,
    });
  } catch (error) {
    console.error(`Error rendering home page: ${error}`);
    throw error;
  }
};

// ===== Authentication Handlers ===== //

/**
 * Handle user login.
 * Validates email and password, sets JWT cookies upon successful login.
 * @route POST /api/user/login
 */
export const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Email is not registered." });

    const passwordsMatch = await comparePasswords(password, user.password);
    if (!passwordsMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });

    // Set JWT cookies
    await setCookies(res, user._id);

    // Redirect based on role
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: user.role.id,
    });
  } catch (error) {
    console.log(`Error in user login: ${error}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please login after sometime",
    });
  }
};

/**
 * Handle user signup.
 * Creates a new user and sets JWT cookies for authentication.
 * @route POST /api/user/signup
 */
export const handleUserSignup = async (req, res) => {
  const { username, tel, email, password, passwordConfirm } = req.body;

  try {
    if (password !== passwordConfirm)
      return res
        .status(401)
        .json({ success: false, message: "Passwords do not match" });

    // Check if user already exists
    const userExists = await findUserByCredentials(username, email, tel);
    if (userExists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });

    // Create user
    const { acknowledged, insertedId } = await createUser({
      username,
      tel,
      email,
      password,
    });
    if (!acknowledged)
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please signup after sometime",
      });

    // Set JWT cookies
    await setCookies(res, insertedId);

    res.status(201).json({ success: true, message: "Signup successful." });
  } catch (error) {
    console.error(`Error in user sign-up: ${error}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please signup after sometime",
    });
  }
};

/**
 * Handle user logout.
 * Clears authentication cookies and redirects the user to the login page.
 * @route GET /api/user/logout
 */
export const handleUserLogout = async (req, res) => {
  try {
    // Clear token cookies
    await clearCookies(res);

    // Redirect to login page
    res.redirect("/api/user/");
  } catch (error) {
    console.error(`Error in /logout route: ${error}`);
    throw error;
  }
};
