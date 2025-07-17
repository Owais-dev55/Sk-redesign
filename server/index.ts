import app from './src/app'
import { initSocketServer } from "./src/socket/chatServer"
import http from 'http'
const port = 3000;
const server = http.createServer(app);

initSocketServer(server);

server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});

