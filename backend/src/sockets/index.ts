import {Server} from "socket.io";
import { env } from "../types/env.js";


export const initSocket = (server:any) => {
     const io = new Server(server, {
        cors: {
            origin: env.CORS_ORIGIN,
            credentials: true
        }
     });

     io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);
        });
     })

     return io;

}