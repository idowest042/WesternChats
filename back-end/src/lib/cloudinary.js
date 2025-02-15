import {v2 as cloudinary} from "cloudinary"
import {config} from "dotenv"
config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // ✅ Correct key name
    api_key: process.env.CLOUDINARY_API_KEY,       // ✅ Ensure it matches your .env variable
    api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ Ensure it matches your .env variable
});

export default cloudinary;