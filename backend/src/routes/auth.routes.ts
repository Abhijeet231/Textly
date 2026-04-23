import { Router } from "express";
import { uploadProfile } from "../middlewares/multer.middleware.js";
import { loginController, logoutController, refreshUser, registerController } from "../controllers/auth.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";



const router = Router();

// regiser
router.post("/register", uploadProfile.single("avatar"), registerController)

// login
router.post("/login", loginController);

// logout
router.post("/logout", verifyJwt, logoutController );

// refresh
router.post("/refresh", refreshUser);


export default router;