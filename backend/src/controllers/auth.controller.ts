// register
// login
// logout
// refresh accesstoken
// get current user

import User from "../models/user.model.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.js"
import { type Request, type Response } from "express"

// Register User
export const registerController = async(req:Request, res:Response) =>{
              
    // Get data
    const {name, email, password} = req.body;
    const file = req.file

    // Validate data


    // generate tokens 

    // hash password (use prebuild method)


    // Create new user & save it 

    // send user details along with access and refreshtoknes

}