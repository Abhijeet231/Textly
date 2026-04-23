import express, {type Express} from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { env } from "./types/env.js";
import authRoutes from "./routes/auth.routes.js"

const createApp = ():Express => {

    const app = express()

    // Middlewares
    app.use(express.json());
  
   

    app.use(cors({
        origin: env.CORS_ORIGIN,
        credentials: true
    }))
    app.use(express.urlencoded({extended:true}))
    app.use(express.static("public"))
    app.use(cookieParser());

    // Routes
    app.use("/api/v1/auth", authRoutes);


    return app;
}

export default createApp;
