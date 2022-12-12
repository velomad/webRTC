import { io } from "socket.io-client";

export const socket = io("https://37f3-2402-e280-3d46-603-fc0e-b6bf-8198-630e.in.ngrok.io", {
  transports: ["websocket"],
});
