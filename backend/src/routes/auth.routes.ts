import { Router } from "express";
import { uploadProfile } from "../middlewares/multer.middleware.js";
import { registerController } from "../controllers/auth.controller.js";



const router = Router();

// regiser
router.post("/register", uploadProfile.single("avatar"), registerController)

