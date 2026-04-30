
import User from "../models/user.model.js"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.utils.js"
import { type Request, type Response } from "express"
import { uploadOnCloudinary } from "../utils/cloudinary.js"



/***   REGISTER USER
   *   @route   POST /api/v1/auth/register
   *   @access  Public
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
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

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


/***   LOGIN USER
   *   @route   POST /api/v1/auth/login
   *   @access  Public
*/

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
      return;
    }

    const checkPass = await user.comparePassword(password);

    if (!checkPass) {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
      return;
    }

    // Payload for token generation
    const payload = {
      id: user._id.toString(),
      email: user.email,
    };

    // Generating Tokens
    const accessToken =  generateAccessToken(payload);
    const refreshToken =  generateRefreshToken(payload);

    // Addign refreshToken & changing online status
    user.refreshToken = refreshToken;
    user.isOnline = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User Logged in Successfully.",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


/***   LOGOUT USER
   *   @route   POST /api/v1/auth/logout
   *   @access  Private
*/
export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      refreshToken: undefined,
      isOnline: false,
      lastSeen: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


/***   REFRESH USER'S ACCESS TOEKN
   *   @route   POST /api/v1/auth/refresh
   *   @access  Public
*/
export const refreshUser = async (req: Request, res: Response) => {

  try {
    //get the user details from the req.header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing"
      });
    }

    // Verify Token
    let verified = await verifyRefreshToken(token);

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: "Token not verified"
      })
    }


    // find user from DB.
    const user = await User.findById(verified.id).select("+refreshToken")

    if (!user || user.refreshToken !== token) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      })
      return;
    }


    const payload = {
      id: user._id.toString(),
      email: user.email
    }

    const newAccessToken = generateAccessToken(payload);


    res.status(200).json({
      success: true,
      message: "Token Refreshed",
      newAccessToken
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token+"
    })
  }


}
