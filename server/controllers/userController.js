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

const loginPage = (req, res) => {
  res.status(200).render("user/userSignIn");
};

const signupPage = (req, res) => {
  res.status(200).render("user/userSignup");
};

const about = (req, res) => {
  res.status(200).render("user/about");
};

const homePage = (req, res) => {
  const { username } = req.user;
  res.status(200).render("user/home", {
    username,
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).send("Invalid email or password.");

    const passwordsMatch = await comparePasswords(password, user.password);
    if (!passwordsMatch)
      return res.status(400).send("Invalid email or password.");

    await setCookies(res, user);

    if (user.role.id === 1) return res.redirect("/api/admin/dashboard");
    return res.status(200).redirect("/api/user/home");
  } catch (error) {
    console.log(`Error in /login route: ${error}`);
    res.status(500).send("Something went wrong. Please login after sometime");
  }
};

const userSignup = async (req, res) => {
  const { username, tel, email, password, passwordConfirm } = req.body;

  try {
    const userExists = await findUserByCredentials(username, email, tel);
    if (userExists) return res.status(400).send("User already exists.");

    if (password !== passwordConfirm)
      return res.status(401).send("Passwords Do not match");

    const user = await createUser(res, { username, tel, email, password });
    console.log(user);
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

const userLogout = async (req, res) => {
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

export {
  loginPage,
  signupPage,
  about,
  homePage,
  userLogin,
  userSignup,
  userLogout,
};
