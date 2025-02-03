import { User } from "../models/user.models.js";

export const getAllUser = async (req, res, next) => {
  try {
    const currentUserId = req.userId;
    const allUser = await User.find({ _id: { $ne: currentUserId } }); //current user should not be included.
    res.json(allUser);
  } catch (err) {
    return res.status(400).json({
      message: "Something went wrong while fetching user's",
    });
  }
};
