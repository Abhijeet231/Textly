// Sending messages & retriving message history

import type { Socket, Server } from "socket.io";
import Message from "../../models/message.model.js";
import Conversation from "../../models/conversation.model.js";
import mongoose from "mongoose";

export const registerMessageHandlers = (io: Server, socket: Socket) => {
    const userId = socket.data.user.id as string;

    // Send a message
    socket.on(
        "message:send",
        async (
            payload: { conversationId: string; text?: string; images?: { url: string; public_id: string }[] },
            callback: (res: { error?: string; message?: any }) => void
        ) => {
            try {
                const { conversationId, text, images } = payload;

                // Verify sender is actually a participant
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: new mongoose.Types.ObjectId(userId),
                });

                if (!conversation) {
                    return callback({ error: "Conversation not found" });
                }

                const message = await Message.create({
                    conversationId,
                    senderId: userId,
                    seenBy: [userId],
                    ...(text && { text }),
                    ...(images && images.length > 0 && { images }),
                });

                // Update the conversation's lastMessage preview
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: {
                        text: text ?? "📷 Image",
                        senderId: userId,
                        createdAt: new Date(),
                    },
                });

                // Emit to everyone in the conversation room (including sender)
                io.to(conversationId).emit("message:new", { message });

                callback({ message });
            } catch (error: any) {
                callback({ error: error.message || "Failed to send message" });
            }
        }
    );

    // Fetch message history for a conversation
    socket.on(
        "message:history",
        async (
            payload: { conversationId: string; page?: number; limit?: number },
            callback: (res: { error?: string; messages?: any[]; hasMore?: boolean }) => void
        ) => {
            try {
                const { conversationId, page = 1, limit = 30 } = payload;

                // Verify participant
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: new mongoose.Types.ObjectId(userId),
                });

                if (!conversation) {
                    return callback({ error: "Conversation not found" });
                }

                const skip = (page - 1) * limit;

                const messages = await Message.find({ conversationId })
                    .sort({ createdAt: -1 }) // newest first
                    .skip(skip)
                    .limit(limit + 1) // fetch one extra to check if there's more
                    .populate("senderId", "name avatar");

                const hasMore = messages.length > limit;
                if (hasMore) messages.pop();

                callback({
                    messages: messages.reverse(), // return oldest-first for rendering
                    hasMore,
                });
            } catch (error) {
                callback({ error: "Failed to fetch messages" });
            }
        }
    );

    // Mark messages as seen
    socket.on(
        "message:seen",
        async (payload: { conversationId: string }) => {
            try {
                const { conversationId } = payload;

                await Message.updateMany(
                    {
                        conversationId,
                        seenBy: { $ne: new mongoose.Types.ObjectId(userId) },
                    },
                    {
                        $addToSet: { seenBy: userId },
                    }
                );

                // Notify others in the room that this user has seen the messages
                socket.to(conversationId).emit("message:seen_update", {
                    conversationId,
                    seenBy: userId,
                });
            } catch (error) {
                console.error("Error marking messages as seen:", error);
            }
        }
    );

};