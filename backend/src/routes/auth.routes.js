const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = Router();

/**
 * @route POST api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUser);

/**
 * @route POST api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", authController.loginUser);

/**
 * @route POST api/auth/logout
 * @desc Logout a user, clears token and adds in blacklist
 * @access private
 */
authRouter.get("/logout", authController.logoutUser);

/**
 * @route GET api/auth/me
 * @desc Returns current auth user data
 * @access private
 */
authRouter.get("/me", authMiddleware,authController.getCurrentUser);

module.exports = authRouter;
