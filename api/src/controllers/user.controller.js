import User from "../models/user.model.js";
import Message from "../models/message.model.js";

//! 1-Function To Get All Users:
export const getAllUsers = async (req, res, next) => {
  try {
    //! get the current user:
    const currentUser = req.auth.userId;
    const users = await User.find({ clerkId: { $ne: currentUser } });

    res.status(200).json(users);
  } catch (error) {
    console.log("Error getting all users", error.message);
    next(error);
  }
};

//! 2-Function To Get All Messages:
export const getAllMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const myId = req.auth.userId;
    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userId,
        },
        {
          senderId: userId,
          receiverId: myId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error getting all messages", error.message);
    next(error);
  }
};
