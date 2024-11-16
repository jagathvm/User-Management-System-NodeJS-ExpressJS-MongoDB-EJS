import {
  createUser,
  findUserByCredentials,
  findUserByEmail,
} from "../services/userServices.js";
import {
  comparePasswords,
  clearCookies,
  setCookies,
} from "../helpers/authHelpers.js";

// ===== Render Pages ===== //
export const renderLoginPage = (req, res) => {
  res.status(200).render("user/userSignIn");
};

export const renderSignupPage = (req, res) => {
  res.status(200).render("user/userSignup");
};

export const renderAboutPage = (req, res) => {
  res.status(200).render("user/about");
};

export const renderHomePage = (req, res) => {
  // Extract from token middleware
  const { username } = req.user;

  res.status(200).render("user/home", {
    username,
  });
};

// ===== Authentication Handlers ===== //
export const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });

    const passwordsMatch = await comparePasswords(password, user.password);
    if (!passwordsMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });

    // Set JWT cookies
    await setCookies(res, user);

    // Redirect based on role
    return res
      .status(200)
      .json({
        success: true,
        message: "Login successful.",
        data: user.role.id,
      });
  } catch (error) {
    console.log(`Error in /login route: ${error}`);
    res.status(500).send("Something went wrong. Please login after sometime");
  }
};

export const handleUserSignup = async (req, res) => {
  const { username, tel, email, password, passwordConfirm } = req.body;

  try {
    if (password !== passwordConfirm)
      return res.status(401).send("Passwords Do not match");

    // Check if user already exists
    const userExists = await findUserByCredentials(username, email, tel);
    if (userExists) return res.status(400).send("User already exists.");

    // Create user
    const user = await createUser(res, { username, tel, email, password });
    if (!user)
      return res
        .status(500)
        .send("Something went wrong. Please signup after sometime");

    res.status(201).redirect("/api/user/home");
  } catch (error) {
    console.error(`Error in /submit route: ${error}`);
    res.status(500).send(`Internal Server Error`);
  }
};

export const handleUserLogout = async (req, res) => {
  try {
    // Clear token cookies
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
