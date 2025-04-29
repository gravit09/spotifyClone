import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:3001" : "/";

const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("[ChatStore] Fetching users...");
      const response = await axiosInstance.get("/users");
      console.log(
        "[ChatStore] Users response:",
        JSON.stringify(response.data, null, 2)
      );
      console.log("[ChatStore] Number of users:", response.data.length);
      set({ users: response.data });
    } catch (error: any) {
      console.error("[ChatStore] Error fetching users:", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId) => {
    if (!get().isConnected) {
      console.log("[Socket] Attempting to connect with userId:", userId);
      socket.auth = { userId };
      socket.connect();

      socket.on("connect", () => {
        console.log("[Socket] Connected!", socket.id);
        socket.emit("user_connected", userId);
        console.log("[Socket] Emitted user_connected:", userId);
      });

      socket.on("disconnect", (reason) => {
        console.log("[Socket] Disconnected:", reason);
      });

      socket.on("connect_error", (err) => {
        console.error("[Socket] Connection error:", err);
      });

      socket.on("users_online", (users: string[]) => {
        console.log("[Socket] users_online event received:", users);
        console.log(
          "[Socket] Current online users:",
          Array.from(get().onlineUsers)
        );
        set({ onlineUsers: new Set(users) });
        console.log(
          "[Socket] Updated online users:",
          Array.from(new Set(users))
        );
      });

      socket.on("activities", (activities: [string, string][]) => {
        console.log("[Socket] activities event received:", activities);
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        console.log("[Socket] user_connected event received:", userId);
        set((state) => {
          const newOnlineUsers = new Set([...state.onlineUsers, userId]);
          console.log(
            "[Socket] Updated online users after connection:",
            Array.from(newOnlineUsers)
          );
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("user_disconnected", (userId: string) => {
        console.log("[Socket] user_disconnected event received:", userId);
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          console.log(
            "[Socket] Updated online users after disconnection:",
            Array.from(newOnlineUsers)
          );
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("receive_message", (message: Message) => {
        console.log("[Socket] receive_message event received:", message);
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("message_sent", (message: Message) => {
        console.log("[Socket] message_sent event received:", message);
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("activity_updated", ({ userId, activity }) => {
        console.log(
          "[Socket] activity_updated event received:",
          userId,
          activity
        );
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });

      set({ isConnected: true });
      console.log("[Socket] Set isConnected true");
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },

  sendMessage: async (receiverId, senderId, content) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit("send_message", { receiverId, senderId, content });
  },

  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
