import { io } from "socket.io-client";
// http://localhost:5000
export const socket = io(
  "https://3fff-2402-e280-3d46-603-fc0e-b6bf-8198-630e.in.ngrok.io",
  {
    transports: ["websocket"],
  }
);
