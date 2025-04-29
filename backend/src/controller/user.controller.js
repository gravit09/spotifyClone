import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    console.log("[UserController] Fetching all users...");

    // Get all users with required fields
    const users = await User.find({
      fullName: { $exists: true, $ne: null },
      imageUrl: { $exists: true, $ne: null },
      clerkId: { $exists: true, $ne: null },
    }).select("fullName imageUrl clerkId _id");

    console.log(
      "[UserController] Found users:",
      JSON.stringify(users, null, 2)
    );
    console.log("[UserController] Number of users:", users.length);

    if (!users || users.length === 0) {
      console.log("[UserController] No users found");
      return res.status(200).json([]);
    }

    // Verify all required fields are present
    const validUsers = users.filter(
      (user) => user.fullName && user.imageUrl && user.clerkId
    );

    console.log("[UserController] Valid users:", validUsers.length);
    res.status(200).json(validUsers);
  } catch (error) {
    console.error("[UserController] Error:", error);
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params;

    console.log(
      "[UserController] Fetching messages between:",
      myId,
      "and",
      userId
    );

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    console.log("[UserController] Found messages:", messages.length);
    res.status(200).json(messages);
  } catch (error) {
    console.error("[UserController] Error:", error);
    next(error);
  }
};
