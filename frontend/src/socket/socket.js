import { io } from "socket.io-client";

const connectSocket = (token) =>
  io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
    auth: {
      token
    }
  });

export default connectSocket;

// import { io } from "socket.io-client";

// const connectSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
//   autoConnect: false
// });

// export default connectSocket;