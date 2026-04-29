import type { Socket, Server } from "socket.io";
import User from "../../models/user.model.js";

export const registerDisconnectHandler = (io:Server, socket:Socket) => {
    
    const userId = socket.data.user.id as string;

    socket.on("disconnect", async() => {
        try {
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