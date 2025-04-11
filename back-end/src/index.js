import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { connectdb } from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

const port = process.env.PORT || 5001;
const __dirname = path.resolve();

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://your-frontend-domain.vercel.app" // Add your production frontend URL
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Static files and frontend routing for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Front-end/dist")));
  
  // Handle SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Front-end/dist/index.html"));
  });
}

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API working', timestamp: new Date() });
});

// Start server
server.listen(port, () => {
  connectdb();
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} on port ${port}`);
});