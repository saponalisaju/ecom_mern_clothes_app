const express = require("express");

const profileController = require("../controllers/profileController");
const { isLoggedOut } = require("../middlewares/auth");

const profileRouter = express.Router();
profileRouter.post("/profile", profileController.profile);

profileRouter.post(
  "/profileLogin",
  isLoggedOut,
  profileController.profileLogin
);

module.exports = profileRouter;
