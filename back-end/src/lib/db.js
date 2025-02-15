import dotenv from "dotenv"; 
dotenv.config();
import mongoose from "mongoose";

export const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`${process.env.MONGO_URL} successfully connected`);
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};
