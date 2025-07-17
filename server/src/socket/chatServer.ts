import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import http from "http";

const prisma = new PrismaClient();

export const initSocketServer = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://sk-redesign-navy.vercel.app",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("send_message", async (msg) => {
      const { senderId, receiverId, content } = msg;

      const saved = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
        },
      });

      io.to(receiverId).emit("receive_message", saved);
    });

    socket.on("mark_read", async ({ readerId, senderId }) => {
      try {
        await prisma.message.updateMany({
          where: {
            receiverId: readerId,
            senderId: senderId,
            read: false,
          },
          data: {
            read: true,
          },
        });

        io.to(senderId).emit("messages_read", { readerId });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
