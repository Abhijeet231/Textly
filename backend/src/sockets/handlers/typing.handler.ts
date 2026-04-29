import type { Socket, Server } from "socket.io";

export const registerTypingHandlers = (
  io: Server,
  socket: Socket
) => {
  const userId = socket.data.user.id as string;

  // User started typing
  socket.on(
    "message:typing",
    (payload: { conversationId: string }) => {
      socket.to(payload.conversationId).emit(
        "message:typing",
        {
          conversationId: payload.conversationId,
          userId,
        }
      );
    }
  );

  // User stopped typing
  socket.on(
    "message:typing_stop",
    (payload: { conversationId: string }) => {
      socket.to(payload.conversationId).emit(
        "message:typing_stop",
        {
          conversationId: payload.conversationId,
          userId,
        }
      );
    }
  );
};