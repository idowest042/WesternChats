import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { connectdb } from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();

const port = process.env.PORT || 5001;

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 
  'http://localhost:5174',
  'https://western-chats.vercel.app',
  'https://backend-chat-sigma.vercel.app'
],// or wherever your frontend is hosted
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.options('*', cors()); // Enable preflight for all routes
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API working', timestamp: new Date() });
});

// Start server
server.listen(port, () => {
  connectdb();
  console.log(`Server running on port ${port}`);
});

export default app; // Important for Vercel