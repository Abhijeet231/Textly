import { verifyAccessToken } from "../utils/jwt.utils.js";
import { type Request, type Response, type NextFunction } from "express";
import User from "../models/user.model.js";
import { type AuthPayload } from "../utils/jwt.utils.js";

const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {

    let token;

    // checking authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1]
    }


    if (!token) {
        return next(new Error("No Token Provided!"))
    }

    // verify token
    let decoded: AuthPayload;
    try {
        decoded = verifyAccessToken(token)
    } catch (error) {
        return next(new Error("Invalid Token!"))
    }

    // finding User
    const user = await User.findById(decoded.id)
    if (!user) {
        return next(new Error("User Not Found!"))
    }

    // attaching user to request
    req.user = user;

    next()

}

export default verifyJwt;
