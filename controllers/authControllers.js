// Menggunakan ES Modules
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { now } from "mongoose";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

const createSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const isDev = process.env.NODE_ENV === "development" ? false : true;

  const cookieOption = {
    expire: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    security: isDev,
  };
  res.cookie("jwt", token, cookieOption);

  user.password = undefined;

  res.status(statusCode).json({
    data: user,
  });
};

export const usersRegistration = asyncHandler(async (req, res) => {
  const isOwner = (await User.countDocuments()) === 0;

  const role = isOwner ? "owner" : "user";

  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: role,
  });
  createSendResToken(createUser, 201, res);
});
export const usersLogin = asyncHandler(async (req, res) => {
  // tahap 1, cek apakah email diisi atau tidak
  if (!req.body.email && !req.body.password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  //tahap 2, cek apakah email ada di db atau tidak
  const userData = await User.findOne({
    email: req.body.email,
  });

  // tahap 3, cek apakah password benar?
  if (userData && (await userData.comparePassword(req.body.password))) {
    createSendResToken(userData, 200, res);
  } else {
    res
      .status(400)
      .json({ message: "Email dan Passwor yang anda masukkan salah" });
  }
});

export const userLogout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "Berhasil logout" });
};
