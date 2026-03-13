import { io } from "socket.io-client";

const token = sessionStorage.getItem("token");

const socket = io("http://localhost:5000", {
  auth: {
    token
  }
});

export default socket;