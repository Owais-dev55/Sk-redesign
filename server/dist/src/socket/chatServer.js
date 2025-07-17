"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const initSocketServer = (server) => {
    const io = new socket_io_1.Server(server, {
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
        socket.on("send_message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
            const { senderId, receiverId, content } = msg;
            const saved = yield prisma.message.create({
                data: {
                    senderId,
                    receiverId,
                    content,
                },
            });
            io.to(receiverId).emit("receive_message", saved);
        }));
        socket.on("mark_read", (_a) => __awaiter(void 0, [_a], void 0, function* ({ readerId, senderId }) {
            try {
                yield prisma.message.updateMany({
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
            }
            catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }));
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};
exports.initSocketServer = initSocketServer;
