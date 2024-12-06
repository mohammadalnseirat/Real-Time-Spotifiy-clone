import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cron from "node-cron";
import fs from "fs";
import { createServer } from "http";
import { connectToDatabase } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import { initializeSocket } from "./lib/socket.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;
//! Initialized SocketServer:
const httpServer = createServer(app);
initializeSocket(httpServer);
app.use(express.json());
app.use(clerkMiddleware()); //! this will add auth to req obj => req.auth
app.use(
  cors({
    origin: process.env.CLIENT_URL, // replace with your frontend URL
    credentials: true, // allow cookies
  })
);

//? file upload:
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 15 * 1024 * 1024, // 15MB
    },
  })
);

//? Cron Jobs:
const tempFileDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempFileDir)) {
    fs.readdir(tempFileDir, (err, files) => {
      if (err) {
        console.log("Error reading temp files directory:", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempFileDir, file), (err) => {});
      }
    });
  }
});

//? Routes Start Here
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/songs", songRoutes);
app.use("/api/v1/albums", albumRoutes);
app.use("/api/v1/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
}

//? Routes End Here
httpServer.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});

//? Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
