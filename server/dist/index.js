"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const chatServer_1 = require("./src/socket/chatServer");
const http_1 = __importDefault(require("http"));
const port = 3000;
const server = http_1.default.createServer(app_1.default);
(0, chatServer_1.initSocketServer)(server);
server.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
