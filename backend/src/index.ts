import "dotenv/config";
import createApp from "./app.js";
import dbConnect from "./db/dbConnect.js";
import http from "node:http";
import { Server } from "socket.io";
import { env } from "./types/env.js";
import { initSocket } from "./sockets/index.js";


const main = async () => {

    try {
        let port = env.PORT || 3000;
    
        // Connecting to Database
        await dbConnect();
        const app = createApp();
    
        const server = http.createServer(app);
    
        // socket instance
        const io = initSocket(server)

        server.listen(port, () =>{
            console.log(`Server is running on Port ${port}`)
        })
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }

};
main()