import express from "express"
import authroutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { connectdb } from "./lib/db.js"
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser"
import cors  from "cors"
import {app, server} from "./lib/socket.js"
import path from "path"
dotenv.config();  // This ensures environment variables are loaded

const port = process.env.PORT || 5001
const __dirname = path.resolve()
app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend URL
    credentials: true                 // Allow sending cookies (if needed)
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser())
app.use('/api/auth', authroutes)
app.use('/api/messages', messageRoutes)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Front-end/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Front-end", "dist", "index.html"));
      });
}  
console.log("JWT_SECRET:", process.env.JWT_SECRET);


server.listen(port,()=>{
    connectdb()
    console.log(`${port} is ready to be used`)
}) 