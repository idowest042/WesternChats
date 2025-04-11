import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
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

  subscribeToMessages: async (selectedUser) => {
     // Get socket from Zustand store
     const { socket } = useAuthStore.getState();
   
     // Check if Selecteduser and socket dey defined
     if (!selectedUser || !socket) return;
   
     // Remove previous event listener to avoid duplication
     socket.off("newMessage");
   
     // Add new event listener for "newMessage"
     socket.on("newMessage", (newMessage) => {
       // Check if message dey from Selecteduser
       const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
       if (!isMessageFromSelectedUser) return;
   
       // Log the new message
       console.log("New message received:", newMessage);
   
       // Update messages state
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