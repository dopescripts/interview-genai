const userModel = require("../models/user.model");
const blacklistTokenModel = require("../models/blacklist.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @name registerUserController
 * @description register a new user, expects username, email, password
 * @access Public
 */
async function registerUser(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(422).json({
      message: "Please provide username, email and password",
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    if ((isUserAlreadyExists.username = username)) {
      return res.status(400).json({
        message: "Account already exists for this username",
      });
    } else {
      return res.status(400).json({
        message: "Account already exists for this email",
      });
    }
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name loginUserController
 * @description login a user, expects email/username or password
 * @access public
 */
async function loginUser(req, res) {
  const { email, password, username } = req.body;
  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(404).json({
      message: "No user found with this email/username",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);
  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name logoutUserController
 * @description logout a user
 * @access private
 */
async function logoutUser(req, res) {
  const token = req.cookies?.token;

  if (token) {
    await blacklistTokenModel.create({ token });
  }

  res.clearCookie("token");

  return res.status(200).json({
    message: "User logged out successfully",
  });
}

async function getCurrentUser(req, res) {
  const user = await userModel.findById(req.user.id);
  return res.status(200).json({
    message: "User fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
