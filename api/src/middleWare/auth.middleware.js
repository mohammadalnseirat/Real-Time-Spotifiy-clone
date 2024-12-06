import { clerkClient } from "@clerk/express";
import { handleError } from "../utils/error.js";

//? protected route if the user is logged in:
export const protectedRoute = async (req, res, next) => {
  if (!req.auth.userId) {
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	next();
};

//? require Admin routes:
export const requireAdmin = async(req,res,next)=>{
  try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		next(error);
	}
}
