import { Server, Socket } from "socket.io";
import Message from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  const userSockets = new Map(); // for the users socket{userId:socketId}
  const userActivities = new Map(); // for the users activity{userId:activity}
  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");
      // broadcast to all connected sockets that this user just logged in
      io.emit("user_connected", userId);
      // online users:
      socket.emit("online_users", Array.from(userSockets.keys()));
      // activity:
      io.emit("activities", Array.from(userActivities.entries()));
    });

    // when start to listen to music or puse it we will sen the event:
    socket.on("update_activities", ({ userId, activity }) => {
      userActivities.set(userId, activity);
      io.emit("activity_update", { userId, activity });
    });

    // send a message:
    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        // create a new message:
        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // send to receiver in realtime, if they're online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        // send to sender:
        socket.emit("message_sent", message);
      } catch (error) {
        console.log("Error sending message", error);
        socket.emit("message_error", error);
      }
    });

    // disconnect:
    socket.on("disconnect", () => {
      let disconnectedUser;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          // find disconnected user
          disconnectedUser = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      // broadcast to all connected sockets that this user just logged out
      if (disconnectedUser) {
        io.emit("user_disconnected", disconnectedUser);
      }
    });
  });
};
