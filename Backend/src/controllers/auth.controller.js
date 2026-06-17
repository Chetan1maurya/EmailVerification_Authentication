import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailSend.js";
import { sendResetPasswordEmail } from '../utils/forgotPassword.js';
import tokenBlacklistModel from '../models/blacklist.model.js';

export const registerUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email and password",
      });
    }

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      if (isUserAlreadyExists.username === username) {
        return res.status(400).json({
          message: "Account already exists with this username",
        });
      }

      return res.status(400).json({
        message: "Account already exists with this email address",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Verification Token is formed")
    const verificationToken =
      crypto.randomBytes(32).toString("hex");
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ), // 24 hours
    });

    const verificationLink =
      `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    console.log("Email is going to get forwarded ", user.email)
    await sendVerificationEmail(
      user.email,
      user.username,
      verificationLink
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginUserController = async(req,res) => { 
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message:"Email and password both are required"
        })
    }
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message: "User does not exists"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Password is not matching"
        })
    }
    const token = jwt.sign({id:user._id, username: user.username}, process.env.SECRET_KEY,{expiresIn:"1d"})
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    })
    return res.status(200).json({
        message: "User Successfully logged In",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

export const logoutUserController = async(req, res) => {
    const token = req.cookies.token
    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    return res.status(200).json({
        message: "User logged out successfully"
    })
}

export const getMeController = async(req, res) => {
    if(req.user.id == null){
        return
    }
    const user = await userModel.findOne({ _id: req.user.id })

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await userModel.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    if (
      !user.verificationTokenExpiresAt ||
      user.verificationTokenExpiresAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired",
      });
    }

    user.isVerified = true;

    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    const resetLink =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendResetPasswordEmail(
      user.email,
      user.username,
      resetLink
    );

    return res.status(200).json({
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};