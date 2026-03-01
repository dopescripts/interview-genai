const { Router } = require("express");

const authRouter = Router();

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", (req, res) => {
  // Registration logic here
  res.send("User registered");
});

module.exports = authRouter;