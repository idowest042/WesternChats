import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js"; // ✅ FIXED
import User from "../models/user.model.js"; // Adjust the path as needed

export const getUsersForSidebar = async (req, res) => {
  try {
    const isLoggedin = req.user._id;
    const FilteredUser = await User.find({ _id: { $ne: isLoggedin } }).select(
      "-password"
    );
    res.status(200).json(FilteredUser);
  } catch (error) {
    console.log("Error in sidenavbar", error);
    res.status(500).json({ msg: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: UsertoChatid } = req.params;
    const myId = req.user._id; // Fix inconsistent user ID variable
    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: UsertoChatid },
        { senderId: UsertoChatid, recieverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
    console.log("error in Messages controller", error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;
    let imageurl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageurl = uploadResponse.secure_url; // ✅ FIXED (correct property reference)
    }

    const Newmessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageurl,
    });

    await Newmessage.save();
    res.status(201).json(Newmessage);
  } catch (error) {
    console.log("error in the send message controller", error);
    res.status(500).json({ msg: "internal server error" });
  }
};
