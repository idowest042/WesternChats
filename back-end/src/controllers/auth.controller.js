import { generateToken } from "../lib/utlis.js";
import User from "../models/user.model.js"; // Ensure this import matches the file name and path
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, password, email, profilePic } = req.body;

  try {
    // Validate input fields
    if (!fullname || !password || !email) {
      return res.status(400).json({ msg: "Please enter complete details" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "Email already exists. Please log in." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const tempUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      profilePic,
    });

    if (tempUser) {
      // Generate token and set it in the response
      generateToken(tempUser._id, res);

      // Send success response
      return res.status(201).json({
        id: tempUser._id,
        fullname: tempUser.fullname,
        email: tempUser.email,
        profilePic: tempUser.profilePic,
      });
    } else {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error in Signup controller:", error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "invalid creditals" });
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).json({ msg: "invalid crediatals" });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error.message, "login error");
    res.status(500).json({ msg: "internal server error try again later" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ msg: "logout was successful" });
  } catch (error) {
    res.status(500).json({ msg: "Oops something went wrong" });
  }
};
export const UpdateProfilepic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ msg: "Profilepic is required" });
    }
    const profilePicUpload = await cloudinary.uploader.upload(profilePic);
    const uploadedataBase = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicUpload.secure_url },
      { new: true }
    );
    res.status(200).json(uploadedataBase);
  } catch (error) {
    console.log("Error update profile controller", error);
    res.status(500).json({ msg: "internal error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error);
    res.status(500).json({ msg: "internal error" });
  }
};
