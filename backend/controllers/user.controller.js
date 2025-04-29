import { User } from "../models/user.models.js";

export const createUser = async (clerkId, username, email, imageUrl) => {
  try {
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return existingUser;
    }

    const newUser = new User({
      clerkId,
      username,
      email,
      imageUrl,
      role: "user",
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

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
