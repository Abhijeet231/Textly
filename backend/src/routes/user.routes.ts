import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { getCurrentUser, getOnlineUsers, getUsers, getUserById } from "../controllers/user.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { onlineUsersQuerySchema, getUsersQuerySchema, getUserByIdParamsSchema } from "../validations/user.validations.js";

const router = Router();

// get current user
router.get("/me", verifyJwt, getCurrentUser);

// get all online users
router.get("/online", verifyJwt, validate(onlineUsersQuerySchema, "query"), getOnlineUsers);

// get all registered users & search any user
router.get("/", verifyJwt, validate(getUsersQuerySchema, "query"), getUsers);

// get user by ID
router.get('/:id', verifyJwt, validate(getUserByIdParamsSchema, "params"), getUserById);

export default router; 