import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", 'https://western-chats.vercel.app'], 
}});



const userSocketMap = {}; 
export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("Updated online users:", userSocketMap);
  }

  // Send updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle sending and broadcasting messages
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    console.log(`Message from ${senderId} to ${receiverId}:`, message);

    // Find the receiver's socket ID
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { senderId, ...message });
    }
    // Emit the message to the sender (optional)
    socket.emit("newMessage", { senderId, ...message });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (userId) delete userSocketMap[userId]; // Ensure userId is valid before deleting
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };