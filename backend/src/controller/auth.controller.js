import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    console.log("[AuthController] Received auth callback for user:", {
      id,
      firstName,
      lastName,
      imageUrl,
    });

    if (!id) {
      console.error("[AuthController] No user ID provided");
      return res
        .status(400)
        .json({ success: false, error: "No user ID provided" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ clerkId: id });
    console.log(
      "[AuthController] Existing user check:",
      existingUser ? "Found" : "Not found",
      existingUser ? `with ID: ${existingUser._id}` : ""
    );

    if (!existingUser) {
      // Create new user
      console.log("[AuthController] Creating new user...");
      const newUser = await User.create({
        clerkId: id,
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl,
      });
      console.log("[AuthController] New user created:", {
        id: newUser._id,
        clerkId: newUser.clerkId,
        fullName: newUser.fullName,
      });
    } else {
      // Update existing user if needed
      console.log("[AuthController] Updating existing user...");
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          fullName: `${firstName || ""} ${lastName || ""}`.trim(),
          imageUrl,
        },
        { new: true }
      );
      console.log("[AuthController] User updated:", {
        id: updatedUser._id,
        clerkId: updatedUser.clerkId,
        fullName: updatedUser.fullName,
      });
    }

    // Verify the user exists in database
    const verifiedUser = await User.findOne({ clerkId: id });
    console.log("[AuthController] Verified user in database:", {
      id: verifiedUser._id,
      clerkId: verifiedUser.clerkId,
      fullName: verifiedUser.fullName,
    });

    // Get total number of users in database
    const totalUsers = await User.countDocuments();
    console.log("[AuthController] Total users in database:", totalUsers);

    res.status(200).json({ success: true, user: verifiedUser });
  } catch (error) {
    console.error("[AuthController] Error in auth callback:", error);
    next(error);
  }
};
