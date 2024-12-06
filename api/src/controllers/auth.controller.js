import User from "../models/user.model.js";

//! Function To Authenticate User with Clerk:
export const authCallback = async (req, res, next) => {
  try {
    const { id, imageUrl, firstName, lastName } = req.body;
    //! check if user already exists
    const user = await User.findOne({ clerkId: id });
    if (!user) {
      // signup
      // ? create a new user
      await User.create({
        clerkId: id,
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl,
      });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in authCallback", error);
    next(error);
  }
};

