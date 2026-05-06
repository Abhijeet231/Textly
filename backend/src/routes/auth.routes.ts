import { Router } from "express";
import { uploadProfile } from "../middlewares/multer.middleware.js";
import { loginController, logoutController, refreshUser, registerController } from "../controllers/auth.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validations.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

// regiser
router.post("/register", uploadProfile.single("avatar"),validate(registerSchema), registerController)

// login
router.post("/login",validate(loginSchema), loginController);

// logout
router.post("/logout", verifyJwt, logoutController );

// refresh
router.post("/refresh", refreshUser);


export default router;
