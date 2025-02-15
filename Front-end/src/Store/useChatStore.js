import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axois.js";
import { useAuthStore } from "./UseAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // Emit the message to the backend
      socket.emit("sendMessage", {
        senderId: useAuthStore.getState().authUser._id,
        receiverId: selectedUser._id,
        message: res.data,
      });

      // Update local state instantly
      set((state) => ({
        messages: [...state.messages, res.data],
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      console.log("New message received:", newMessage);
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    get().subscribeToMessages(); // Subscribe when user is selected
  },
}));