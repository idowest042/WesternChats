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

app.use(cors({
  origin: [
    'https://western-chats.vercel.app',
    'http://localhost:5173',
    // Add your image CDN domains here, for example:
    'https://res.cloudinary.com' // If using Cloudinary
  ],
  credentials: true,
  // Add this to exclude images from credentials requirement:
  preflightContinue: true // Allows OPTIONS to pass through
}));

// Special handling for image routes
app.use('/images', cors({
  origin: true, // Allow all origins for images
  credentials: false // No need for credentials
}));
// Allow images from Cloudinary/CDN
app.use((req, res, next) => {
  if (req.path.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  }
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
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