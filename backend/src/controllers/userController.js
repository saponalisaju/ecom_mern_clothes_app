const { jwtActivationKey } = require("../../secret");
const { createToken } = require("../helpers/jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../models/userModel");

exports.sign_up = async (req, res, next) => {
  try {
    const check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ error: "User already exists" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: hash,
      cartData: cart,
    });

    await user.save();
    const data = {
      user: {
        id: user.id,
      },
    };

    const token = createToken(data, jwtActivationKey, "30m");
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error signing up:", error.message);
    res.status(500).json({
      message: "An error occurred during sign-up.",
      error: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const compare = bcrypt.compareSync(req.body.password, user.password);
    if (!compare) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createToken({ id: user._id }, jwtActivationKey, "30m");
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetch_user = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, jwtActivationKey);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
};

exports.add_to_cart = async (req, res, next) => {
  try {
    console.log("Added", req.body.itemId);
    const userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Added");
  } catch (error) {
    next(error);
  }
};

exports.remove_from_cart = async (req, res, next) => {
  try {
    console.log("Removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Removed");
  } catch (error) {
    next(error);
  }
};

exports.get_cart = async (req, res, next) => {
  try {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
  } catch (error) {
    next(error);
  }
};
