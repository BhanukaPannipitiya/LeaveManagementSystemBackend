import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    console.log("here at the sign up");

    try {
        if (!email || !password || !name) {
            throw new Error("Please fill all the fields");
        }

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });
        console.log("user ", user);
        await user.save();

        // JWT authentication
        generateTokenAndSetCookie(res, user._id);

        // Send email verification token
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        if (!res.headersSent) {  // Check if headers are already sent
            res.status(400).json({ success: false, message: error.message });
        } else {
            console.error("Headers already sent:", error);
        }
    }
}


export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({ success: true, message: "Email verified successfully", user: { ...user._doc, password: undefined } });

    } catch (error) {
        console.log("Error verifying email", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        await sendVerificationEmail(user.email, verificationToken);



    } catch (error) {
        console.log("Error resending verification email", error);
        res.status(500).json({ success: false, message: error.message });
    }

}


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        generateTokenAndSetCookie(res, user._id);
        user.lastlogin = Date.now();
        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        await user.save();

        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({ success: true, message: "Logged in successfully", user: { ...user._doc, password: undefined } });

    } catch (error) {
        console.log("Error logging in", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        //generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // in 1 hour the token will expire

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        //send reset password email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset email sent successfully" });

    } catch (error) {
        console.log("Error sending email", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        //update the password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendPasswordResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.log("Error resetting password", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user: { ...user._doc, password: undefined } });
    } catch (error) {
        console.log("Error checking auth", error);
        res.status(500).json({ success: false, message: error.message });
    }
}