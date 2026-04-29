import type { Socket, Server } from "socket.io";
import User from "../../models/user.model.js";

export const registerDisconnectHandler = (io: Server, socket: Socket, onlineUsers: Map<string, Set<string>>) => {

    const userId = socket.data.user.id as string;

    socket.on("disconnect", async () => {
        try {

            // Remove the socket ID from the set of connections for this user
            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                }
            }

            await User.findByIdAndUpdate(userId, {
                isOnline: false,
                lastSeen: new Date(),
            });

            // Tell everyone that this user went offline
            // socket.broadcast sends to all other connected sockets

            socket.broadcast.emit("user:offline", {
                userId,
                lastSeen: new Date(),
            })

        } catch (error) {
            console.error("Disconnect error:", error);
        }
    })
}