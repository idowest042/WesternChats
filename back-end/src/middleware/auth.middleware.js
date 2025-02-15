import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // Ensure this import matches the file name and path

export const protectRoute = async (req, res, next) => {
    try {
        // Ensure token exists in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(400).json({ msg: "Unauthorized access: No token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ msg: "Invalid token" });
        }

        // Find the user from the database
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next(); // Continue to the next middleware or route
    } catch (error) {
        console.log("Error in protect route middleware:", error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};
