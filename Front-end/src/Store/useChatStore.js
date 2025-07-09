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
    // Add temporary message with loading status
    const tempMessage = {
      ...messageData,
      _id: Date.now().toString(), // Temporary ID
      createdAt: new Date(),
      status: 'sending',
      senderId: useAuthStore.getState().authUser._id
    };

    set((state) => ({
      messages: [...state.messages, tempMessage]
    }));

    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

    // Update the temporary message with real data
    set((state) => ({
      messages: state.messages.map(msg => 
        msg._id === tempMessage._id ? { ...res.data, status: 'sent' } : msg
      )
    }));

    socket.emit("sendMessage", {
      senderId: useAuthStore.getState().authUser._id,
      receiverId: selectedUser._id,
      message: { ...res.data, status: 'sent' }
    });

  } catch (error) {
    // Update message status to failed
    set((state) => ({
      messages: state.messages.map(msg => 
        msg._id === tempMessage._id ? { ...msg, status: 'failed' } : msg
      )
    }));
    toast.error(error.response.data.message);
  }
},

  subscribeToMessages: () => {
  const { selectedUser } = get();
  const { socket, authUser } = useAuthStore.getState();
  
  if (!selectedUser || !socket) return;

  socket.off("newMessage");
  
  socket.on("newMessage", (newMessage) => {
    // Skip if message is from ourselves (already handled in sendMessage)
    if (newMessage.senderId === authUser._id) return;

    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  });

  // Handle message read receipts
  socket.on("messageRead", ({ messageId }) => {
    set((state) => ({
      messages: state.messages.map(msg => 
        msg._id === messageId ? { ...msg, status: 'read' } : msg
      )
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