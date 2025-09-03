const { mongoose } = require("mongoose");
const { jwtActivationKey } = require("../../secret");
const Profile = require("../models/profileModel");
const { createToken } = require("../helpers/jsonwebtoken");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");

exports.profile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await Profile.exists({ email });
    if (user) {
      throw createError(409, "User all ready exist : Please sign in");
    }

    const newUser = {
      name,
      email,
      password,
    };

    const token = createToken(newUser, jwtActivationKey, "30m");
    const saveUser = await new Profile(newUser).save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: {
        name: saveUser.name,
        email: saveUser.email,
        token: token,
      },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id");
    }
    next(error);
  }
};

exports.profileLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Profile.findOne({ email });
    if (!user) {
      return res.status(401).json("User not found ");
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json("Invalid email or password");
    }

    const token = createToken({ id: user._id }, jwtActivationKey, "30m");
    const refreshToken = createToken({ id: user._id }, jwtActivationKey, "7d");

    res.cookie("accessToken", token, {
      maxAge: 30 * 60 * 1000, // 30 minute
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: `Bearer ${token}`,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
