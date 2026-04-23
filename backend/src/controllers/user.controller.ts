import User from "../models/user.model.js";
import { type Request, type Response } from "express";
import mongoose from "mongoose";



/***   GET CURRENT USER
   *   @route   GET /users/me
   *   @access  Private
*/
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // find user by using decodedTokens.id
        const user = await User.findById(req.user.id).select("name email avatar isOnline")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Current User Not Found'
            })
        }

        //send user
        return res.status(200).json({
            success: true,
            message: "Current User Fetched Successfully.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isOnline: user.isOnline,
            }
        })


    } catch (error) {
        console.error("Error while fetching current user:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


/***   GET ALL ONLINE USERS except current user
   *   @route   GET /users/online?page=1&limit=10
   *   @access  Private
*/
export const getOnlineUsers = async (req: Request, res: Response) => {

    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // pagination 
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 6, 1);

        const safeLimit = Math.min(limit, 50);

        const skip = (page - 1) * safeLimit;


        const onlineUsers = await User.find({
            _id: { $ne: req.user.id },
            isOnline: true
        }).select("name email avatar isOnline lastSeen").skip(skip).limit(safeLimit).sort({ lastSeen: -1 });

        // scroll 
        const hasMore = onlineUsers.length === safeLimit;

        return res.status(200).json({
            success: true,
            message: "Online users fetched successfully",
            users: onlineUsers,
            hasMore

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}


/*** GET ALL USERS / SEARCH USERS (excluding current user)
 *   @route  GET /users?search=abhi&page=1&limit=10
 *   @access Private
 */
export const getUsers = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const search = String(req.query.search || "").trim();

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 6, 1);
        const safeLimit = Math.min(limit, 50);
        const skip = (page - 1) * safeLimit;

        const filter: any = {
            _id: { $ne: req.user.id }
        };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const users = await User.find(filter)
            .select("name email avatar isOnline lastSeen")
            .sort({ isOnline: -1, lastSeen: -1 })
            .skip(skip)
            .limit(safeLimit);

        const hasMore = users.length === safeLimit;

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
            hasMore
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


/***  GET USER BY ID
  *   @route   GET /users/:id
  *   @access  Private
*/
export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User id is required"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            });
        }

        const user = await User.findById(id)
        .select("name email avatar isOnline lastSeen");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User fetched Successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
