// sockets/index.ts

import { Server } from "socket.io";
import { env } from "../types/env.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";

import { registerConversationHandlers } from "./handlers/conversation.handler.js";
import { registerDisconnectHandler } from "./handlers/disconnect.handler.js";
import { registerMessageHandlers } from "./handlers/message.handler.js";
import { registerTypingHandlers } from "./handlers/typing.handler.js";


export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  // Auth middleware — runs before every connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token; // client wil send token in handshake auth
      if (!token) return next(new Error("Unauthorized"));
      const decoded = verifyAccessToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id, "| User:", socket.data.user.id);

    registerConversationHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerTypingHandlers(io, socket);
    registerDisconnectHandler(io, socket);
  });

  return io;
};