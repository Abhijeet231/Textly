import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import fs from "node:fs";
import { env } from "../types/env.js";


cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string,
    folder: string = "Textly/others"): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder
        });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }

        console.log("Error in Cloudinary:", error)
        return null;
    }
}
