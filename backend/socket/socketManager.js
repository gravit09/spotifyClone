import { Server } from "socket.io";
import { User } from "../models/user.models.js";
import { createUser } from "../controllers/user.controller.js";

const onlineUsers = new Map();

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle user login
    socket.on("user-login", async (userId) => {
      console.log("Received user-login event for userId:", userId);
      try {
        let user = await User.findOne({ clerkId: userId });
        console.log("Found user in database:", user ? "Yes" : "No");

        if (!user) {
          // If user doesn't exist, create a new one
          console.log("Creating new user for clerkId:", userId);
          // Generate a shorter, more readable username
          const randomNum = Math.floor(Math.random() * 1000);
          const username = `user${randomNum}`;

          user = await createUser(
            userId,
            username,
            `${username}@spotify-clone.com`,
            null
          );
          console.log("Created new user:", user);
        }

        const userData = {
          userId: user.clerkId,
          username: user.username,
          imageUrl:
            user.imageUrl ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(user.username),
          currentSong: null,
        };

        console.log("Setting user data:", userData);
        onlineUsers.set(socket.id, userData);

        // Send the updated list to all connected clients
        const usersList = Array.from(onlineUsers.values());
        console.log("Emitting user-list-update with users:", usersList);
        io.emit("user-list-update", usersList);
      } catch (error) {
        console.error("Error in user-login:", error);
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      onlineUsers.delete(socket.id);
      const usersList = Array.from(onlineUsers.values());
      console.log("Remaining online users:", usersList);
      io.emit("user-list-update", usersList);
    });

    // Handle current song updates
    socket.on("update-current-song", (songData) => {
      const userData = onlineUsers.get(socket.id);
      if (userData) {
        userData.currentSong = songData;
        onlineUsers.set(socket.id, userData);
        const usersList = Array.from(onlineUsers.values());
        io.emit("user-list-update", usersList);
      }
    });

    // Handle messages
    socket.on("send-message", (message) => {
      const userData = onlineUsers.get(socket.id);
      if (userData) {
        const messageWithUser = {
          ...message,
          userId: userData.userId,
          username: userData.username,
          imageUrl: userData.imageUrl,
          timestamp: new Date(),
        };
        io.emit("new-message", messageWithUser);
      }
    });
  });

  return io;
};
