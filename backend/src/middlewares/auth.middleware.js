const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklist.model");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized, token not found",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const isBlacklisted = await blacklistTokenModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized, token is blacklisted",
    });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;