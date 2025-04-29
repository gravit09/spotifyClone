import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { Song } from "@/types";

interface OnlineUser {
  userId: string;
  username: string;
  imageUrl: string;
  currentSong: {
    title: string;
    artist: string;
    albumArt: string;
  } | null;
}

interface Message {
  userId: string;
  username: string;
  imageUrl: string;
  content: string;
  timestamp: Date;
}

interface SocketStore {
  socket: Socket | null;
  onlineUsers: OnlineUser[];
  messages: Message[];
  isConnected: boolean;
  connect: (userId: string) => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  updateCurrentSong: (song: Song | null) => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  onlineUsers: [],
  messages: [],
  isConnected: false,

  connect: (userId: string) => {
    if (!userId) {
      console.error("No userId provided for socket connection");
      return;
    }

    console.log("🔌 Attempting to connect to socket with userId:", userId);
    const socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
      {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    socket.on("connect", () => {
      console.log("✅ Socket connected successfully with id:", socket.id);
      set({ isConnected: true });
      console.log("📤 Emitting user-login event with userId:", userId);
      socket.emit("user-login", userId);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      set({ isConnected: false });
    });

    socket.on("user-list-update", (users) => {
      console.log("👥 Received user list update. Total users:", users.length);
      console.log("Users:", users);
      set({ onlineUsers: users });
    });

    socket.on("user-joined", (user) => {
      console.log("👋 New user joined:", user);
    });

    socket.on("user-left", (userId) => {
      console.log("👋 User left:", userId);
    });

    socket.on("new-message", (message) => {
      console.log("💬 Received new message:", message);
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      console.log("🔌 Disconnecting socket");
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  sendMessage: (content: string) => {
    const { socket } = get();
    if (socket) {
      console.log("📤 Sending message:", content);
      socket.emit("send-message", {
        content,
      });
    }
  },

  updateCurrentSong: (song: Song | null) => {
    const { socket } = get();
    if (socket) {
      if (song) {
        const songData = {
          title: song.title,
          artist: song.artist,
          albumArt: song.imageUrl,
        };
        console.log("🎵 Updating current song:", songData);
        socket.emit("update-current-song", songData);
      } else {
        console.log("🎵 Clearing current song");
        socket.emit("update-current-song", null);
      }
    }
  },
}));
