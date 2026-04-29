import type { Socket, Server } from "socket.io";
import Conversation from "../../models/conversation.model.js"
import mongoose from "mongoose";


export const registerConversationHandlers = (io: Server, socket: Socket) => {
  const userId = socket.data.user.id as string;

  // Client emits this to open a chat with someone
  // Gets existing conversation or creates a new one, then joins the room
  socket.on(
    "conversation:open",
    async (
      payload: { participantId: string },
      callback: (res: { error?: string; conversation?: any }) => void
    ) => {
      try {
        const { participantId } = payload;

        if (participantId === userId) {
          return callback({ error: "Cannot open conversation with yourself" });
        }

        let conversation = await Conversation.findOne({
          participants: {
            $all: [
              new mongoose.Types.ObjectId(userId),
              new mongoose.Types.ObjectId(participantId)
            ] 
          },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [userId, participantId],
          });
        }

        // Join the socket room for this conversation
        const roomId = conversation._id.toString();
        socket.join(roomId);

        callback({ conversation });
      } catch (error) {
        callback({ error: "Failed to open conversation" });
      }
    }
  );

  // When user opens app, rejoin all their existing conversation rooms 
  // ( this is  something like turning the radio into right frequency to listen to the ongoing conversation)
  socket.on("conversation:rejoin_all", async () => {
    try {
      const conversations = await Conversation.find({
        participants: userId,
      }).select("_id");

      for (const convo of conversations) {
        socket.join(convo._id.toString());
      }
    } catch (error) {
      console.error("Error rejoining conversations:", error);
    }
  });

  // Get all conversations for the current user (for the client sidebar Ui)
  socket.on(
    "conversation:list",
    async (
      callback: (res: { error?: string; conversations?: any[] }) => void
    ) => {
      try {
        const conversations = await Conversation.find({
          participants: userId,
        })
          .populate("participants", "name avatar isOnline lastSeen")
          .sort({ updatedAt: -1 });

        callback({ conversations });
      } catch (error) {
        callback({ error: "Failed to fetch conversations" });
      }
    }
  );
};


// Important:
// If you call only `conversation:list` and skip `rejoin_all`,
// the sidebar will load existing conversations,
// but new messages will never arrive in real time
// because the socket has not joined any rooms.

// If you call only `rejoin_all` and skip `conversation:list`,
// real-time messages will arrive correctly,
// but the sidebar will be empty on initial load.