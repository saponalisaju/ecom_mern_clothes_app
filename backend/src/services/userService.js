const createError = require("http-errors");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { createToken } = require("../helpers/jsonwebtoken");

const sendEmail = require("../helpers/email");
const jwt = require("jsonwebtoken");
const { jwtResetPasswordKey } = require("../../secret");

exports.findUsers = async (search, limit, page) => {
  try {
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    if (!users || users.length === 0) {
      throw createError(404, "Users not found");
    }

    return {
      users,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        totalNumberOfPages: count,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.findUserById = async (id, options = {}) => {
  try {
    const user = await User.findById({ _id: id, options });
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id");
    }
    throw error;
  }
};

exports.deleteUserById = async (id, options = {}) => {
  try {
    const user = await User.findByIdAndDelete({ _id: id, isAdmin: false });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id");
    }
    throw error;
  }
};

exports.updateUserById = async (req, userId, image) => {
  try {
    const options = { password: 0 };
    const user = await User.findById({ _id: userId }, options);
    if (!user) {
      throw new Error("User is not found");
    }
    const updateOption = { new: true, runValidators: true, context: "query" };
    let updates = {};
    const allowedFiled = ["name", "password", "phone", "address"];
    for (let key in req.body) {
      if (allowedFiled.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw new Error("Email can not be updated");
      }
    }
    // const image = req.file?.path;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "File too large. It must be less then 2 MB");
      }

      const { secure_url, public_id } = await uploadUserFile(
        image,
        "eCommerceMern/users"
      );

      updates.image = secure_url;
      updates.imagePublicId = public_id;
      if (user || user.image) {
        const publicId = await publicIdFromUrl(user.image);
        await deleteFileFromCloudinary(publicId);
      }

      // updates.image = image;
      // if (user.image !== "default.jpeg") {
      //   await deleteImage(user.image);
      // }
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOption
    ).select("-password");
    if (!updatedUser) {
      throw createError(404, "User with this id does not exists");
    }
    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id");
    }
    throw error;
  }
};

exports.userActionMange = async (userId, action) => {
  try {
    let update;
    let successMessage;
    if (action === "ban") {
      (update = { isBanned: true }),
        (successMessage = "User was banned successfully");
    } else if (action === "unBan") {
      (update = { isBanned: false }),
        (successMessage = "User was unbanned successfully");
    } else {
      throw createError(400, "Invalid action. Use 'ban' or 'unBan'");
    }
    const updateOption = { new: true, runValidator: true, context: "query" };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOption
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User does not banned");
    }
    return successMessage;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid Id");
    }
    throw error;
  }
};

exports.UpdatePasswordById = async (
  userId,
  email,
  oldPassword,
  newPassword,
  confirmedPassword
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, "User not found");
  }
  if (newPassword !== confirmedPassword) {
    throw createError(400, "New password and confirmed Password did not match");
  }
  const idPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!idPasswordMatch) {
    throw createError(401, "Old password is not match");
  }
  const updated = { $set: { password: newPassword } };
  const updatedOption = { new: true, runValidator: true };
  const updateUser = await User.findByIdAndUpdate(
    userId,
    updated,
    updatedOption
  ).select("-password");
  if (!updateUser) {
    throw createError(400, "Password not updated");
  }
};

exports.forgetPasswordByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "Email not found. Your verified email address. Please enter verified email"
      );
    }
    const token = createToken({ email }, jwtResetPasswordKey, "20m");
    const emailData = {
      email,
      subject: "Reset password Email",
      html: `<h2>Hello ${user.name}!</h2>
      <p>Please click here this link <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">Reset your password</a></p>`,
    };
    try {
      await sendEmail(emailData);
      return token;
    } catch (emailError) {
      throw createError(500, "Failed to send reset password email");
    }
  } catch (error) {
    throw error;
  }
};

exports.resetPasswordByEmail = async (token, password) => {
  try {
    const decoded = jwt.verify(token, jwtResetPasswordKey);
    if (!decoded) {
      throw createError(404, "Invalid or expired token");
    }
    const filter = { email: decoded.email };
    const updated = { password: password };
    const updatedOption = { new: true };
    const updatedUser = await User.findOneAndUpdate(
      filter,
      updated,
      updatedOption
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "Password reset failed");
    }
  } catch (error) {
    throw error;
  }
};
