const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { jwtAccessKey } = require("../../secret");
const User = require("../models/userModel");
const { createToken } = require("../helpers/jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw createError(401, "Access denied. No token provided.");
    }
    const decoded = jwt.verify(token, jwtAccessKey);
    if (!decoded) {
      throw createError(401, "Invalid access token. Please login");
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    next(error);
  }
};

const isLoggedOut = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if (decoded) {
          throw createError(400, "User is already logged in");
        }
      } catch (error) {
        throw error;
      }
    }
    next();
  } catch (error) {
    return next(error);
  }
};

// exports.authenticateToken = (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) return res.status(401).send("Access Denied");

//   try {
//     const verified = jwt.verify(token, jwtActivationKey);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).send("Invalid Token");
//     res.redirect("/login");
//   }
// };

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Access Denied");
  }
  try {
    const verified = createToken(token, jwtAccessKey);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json("Invalid Token");
  }
};

module.exports = { isAuthenticated, isLoggedIn, isLoggedOut };
