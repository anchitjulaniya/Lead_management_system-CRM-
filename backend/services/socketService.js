const jwt = require("jsonwebtoken");

let io;


exports.initialize = (socketServer) => {

  io = socketServer;

  io.use((socket, next) => {

    try {

      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;

      next();

    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication error"));
    }

  });


  io.on("connection", (socket) => {

    const userId = socket.user.sub;

    console.log("User connected:", userId);


    socket.join(userId);

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });

  });

};


exports.sendNotification = (userId, notification) => {

  if (!io) return;

  io.to(userId.toString()).emit("notification", notification);

};

exports.emit = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};