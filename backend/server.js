const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const socketService = require("./services/socketService");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",    
  }
});

socketService.initialize(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});