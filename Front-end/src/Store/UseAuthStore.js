import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"; // Ensure the correct file path
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Base_Url = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://backend-chat-sigma.vercel.app";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSignup: false,
  isLogging: false,
  isUpdatingProfile: false,
  ischeckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Check authentication status
  checkAuth: async () => {
    set({ ischeckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectsocket(); // Connect socket after authentication
    } catch (error) {
      console.error("CheckAuth Error:", error.response?.data || error.message);
      set({ authUser: null });
    } finally {
      set({ ischeckingAuth: false });
    }
  },

  // Sign up a new user
  signup: async (data) => {
    set({ isSignup: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data });
      toast.success("Account Created successfully");
      get().connectsocket(); // Connect socket after signup
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Signup failed");
    } finally {
      set({ isSignup: false });
    }
  },

  // Log in the user
  login: async (data) => {
    set({ isLogging: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data });
      toast.success("Login successfully");
      get().connectsocket(); // Connect socket after login
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      set({ isLogging: false });
    }
  },

  // Log out the user
  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({ authUser: null });
      toast.success("Logout successfully");
      get().disconnectSocket(); // Disconnect socket on logout
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error.message);
      toast.error(error.response.message||error );
    }
  },

  // Update user profile
  updateprofile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/Update-Profile", data);
      set({ authUser: response.data });
      toast.success("Profile updated");
    } catch (error) {
      console.error("UpdateProfile Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Connect Socket.IO
  connectsocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(Base_Url, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect(); // Corrected method name
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // Disconnect Socket.IO
  disconnectSocket: () => {
    const socket = get().socket; // Get the socket object
    if (socket?.connected) socket.disconnect(); // Disconnect if connected
  },
}));