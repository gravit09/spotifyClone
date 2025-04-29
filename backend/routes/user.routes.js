import express from "express";
import { authenticateClerk } from "../middlewares/isAuthenticated.js";
import { isAllowed } from "../controllers/auth.contoller.js";
import { getAllUser } from "../controllers/user.controller.js";
import { Webhook } from "svix";
import { User } from "../models/user.models.js";

const router = express.Router();

// Protected routes
router.route("/protected").get(authenticateClerk, isAllowed);
router.route("/").post(authenticateClerk, getAllUser);

// Clerk webhook route
router.post("/webhook", async (req, res) => {
  const payload = req.body;
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const { id, ...attributes } = evt.data;

  // Handle different Clerk webhook events
  switch (evt.type) {
    case "user.created":
      // Create user in your database
      await User.create({
        clerkId: id,
        email: attributes.email_addresses[0].email_address,
        username: attributes.username,
        imageUrl: attributes.image_url,
      });
      break;
    case "user.updated":
      // Update user in your database
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: attributes.email_addresses[0].email_address,
          username: attributes.username,
          imageUrl: attributes.image_url,
        }
      );
      break;
    case "user.deleted":
      // Delete user from your database
      await User.findOneAndDelete({ clerkId: id });
      break;
  }

  return res.status(200).json({ success: true });
});

export default router;
