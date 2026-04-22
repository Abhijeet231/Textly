// register
// login
// logout
// refresh accesstoken
// get current user

import User from "../models/user.model.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.js"
import { type Request, type Response } from "express"
import { type AuthPayload } from "../utils/jwt.utils.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


/**   REGISTER USER
 
   POST  /api/v1/auth/register 
 */
export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {

        // Get data
        const { name, email, password } = req.body;


        // checking existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
            return;
        }

        // Profile Image handing
        let avatarData = {};

        if (req.file?.path) {
            const uploaded = await uploadOnCloudinary(
                req.file.path,
                "Textly/profile"
            );

            if (uploaded) {
                avatarData = {
                    url: uploaded.secure_url,
                    public_id: uploaded.public_id
                };
            }
        }


        // Create new user & save it 
        const user = await User.create({
            name,
            email,
            password,
            avatar: avatarData,
            isOnline: true,

        })

        // payload
        const payload = {
            id: user._id.toString(),
            email: user.email,
        };

        // Generate Tokens
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Save refreshToken in the DB
        user.refreshToken = refreshToken;
        await user.save();

        // send user details along with access and refreshtoknes
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isOnline: user.isOnline,
            }
        })

    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
};


/**   LOGIN USER
 
   POST  /api/v1/auth/login 
 */

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {

        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            res.status(409).json({
                success: false,
                message: "user not found!"
            });
            return;
        }

        // checkign password
        let checkPass = await user.comparePassword(password);
        if (!checkPass) {
            res.status(409).json({
                success: false,
                message: "Invalid Credentials"
            });
            return;
        }

        // payload
        const payload = {
            id: user._id.toString(),
            email: user.email
        }

        // Generate Tokens
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // save refreshToken & change online status
        user.refreshToken = refreshToken;
        user.isOnline = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User Loggedin Successfully.",
            accessToken,
            refreshToken,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isOnline: user.isOnline,
            }
        })


    } catch (error) {
            console.error("Login Error:", error);

            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
    }
}