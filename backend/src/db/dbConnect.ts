import mongoose from "mongoose";
import { env } from "../types/env.js";

const dbConnect = async (): Promise<void> => {
    try {
        
        const connectionInstance = await mongoose.connect(env.MONGODB_URI);
        console.log("MonogDB Connected")

    } catch (error) {
        console.error("Error while connecting to MongoDB", error)
        throw new Error("Error while connecting to MongoDB", {cause: error})

        
    }
}

export default dbConnect