import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { getCurrentUser, getOnlineUsers,getUsers , getUserById } from "../controllers/user.controller.js";

const router = Router();

// get current user
router.get("/me", verifyJwt, getCurrentUser);

// get all online users
router.get("/online", verifyJwt, getOnlineUsers);

// get all registered users & search any user
router.get("/", verifyJwt, getUsers);

// get user by ID
router.get('/:id',verifyJwt, getUserById);

export  default router;