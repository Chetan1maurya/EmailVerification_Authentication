import express from 'express'
import tokenBlacklistModel from '../models/blacklist.model.js'
import { forgotPasswordController, getMeController, loginUserController, logoutUserController, registerUserController, resetPasswordController, verifyEmailController } from '../controllers/auth.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
const authRouter = express.Router()

authRouter.post("/register",registerUserController);

authRouter.post("/login", loginUserController);

authRouter.get("/logout", logoutUserController);

authRouter.get("/get-me", authUser, getMeController);

authRouter.get("/verify-email/:token",verifyEmailController);

authRouter.post("/forgot-password",forgotPasswordController);

authRouter.post("/reset-password/:token", resetPasswordController);

export default authRouter