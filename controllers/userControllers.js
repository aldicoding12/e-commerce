import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User tidak di temukan" });
  }
});
