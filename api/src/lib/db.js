import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    const connecting = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`MongoDB Connecting to ${connecting.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1); //! 1 is failure, 0 is success
  }
};
