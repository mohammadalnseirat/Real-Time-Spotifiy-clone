import { axiosInstance } from "@/lib/axios";
import { message, user } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

//! define the type of the element:
interface ChatStore {
  users: user[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: message[];
  selectedUser: user | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (senderId: string, content: string, receiverId: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: user | null) => void;
}

//? init the socket from the frontend:
const baseUrl = import.meta.env.MODE === 'development' ? "http://localhost:5000" : '/';
const socket = io(baseUrl, {
  autoConnect: false, // only connect if user is authenticated
  withCredentials: true,
});
const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  //! 1-Function to get Activity Users:
  fetchUsers: async () => {
    try {
      const response = await axiosInstance.get("/v1/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  //! 2-Function to Init Socket:
  initSocket: (userId) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();
      socket.emit("user_connected", userId);
      // listen to online users:
      socket.on("online_users", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });
      // listen to activities:
      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      // user conntection:
      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });
      // listen to disconnect:
      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return {
            onlineUsers: newOnlineUsers,
          };
        });
      });

      // listen to receive message:
      socket.on("receive_message", (message: message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      // listen to send message:
      socket.on("message_sent", (message: message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      // listen to update activities:
      socket.on("activity_update", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return {
            userActivities: newActivities,
          };
        });
      });

      // update is connected:
      set({ isConnected: true });
    }
  },
  //! 3-Function To Disconnect Socket:
  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },
  //! 4-Function To Send Message:
  sendMessage: (receiverId, senderId, content) => {
    const socket = get().socket;
    if (!socket) return;
    socket.emit("send_message", { senderId, content, receiverId });
  },
  //! 5-Function To Fetch Messages:
  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/v1/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  //! 6-Function To Set Selected User:
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
}));

export default useChatStore;
