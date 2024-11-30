import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email";


export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password, contact } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode(); //6 digit code, sent over mail

        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 1 day (in miliseconds)
        });

        //generate cookie and return with response
        generateToken(res, user); 
        await sendVerificationEmail(email,verificationToken);

        const userWithoutPassword = await User.findOne({ email }).select("-password");

        return res.status(201).json({
            success: true,
            message: "Account Created successfully",
            user: userWithoutPassword
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "Invalid email or password"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                status: false,
                message: "Invalid email or password"
            });
        }
        generateToken(res, user); //cookie
        user.lastLogin = new Date();
        await user.save();

        const userWithoutPassword = await User.findOne({ email }).select("-password"); //sending user without password to frontend
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { verificationCode } = req.body;
        const user = await User.findOne({ verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() } }).select("-password");

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or Token Expired"
            });
        }
        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined;
        await user.save(); 

        //Welcome Email
        await sendWelcomeEmail(user.email, user.fullname);

        return res.status(200).json({
            success:true,
            message:"Email Verified successfully",
            user
        });

    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (_:Request,res:Response)=>{
    try {
         return res.clearCookie("token").status(200).json({
            success: true,
            message:"Logged out Successfully"
         });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const forgotPassword= async (req:Request,res:Response)=>{
    try {
        const {email} =req.body;
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User dosen't exist"
            });
        }
        const resetToken = crypto.randomBytes(40).toString("hex");
        const resetTokenExpiresAt= new Date(Date.now()+1*60*60*1000);
        user.resetPasswordToken=resetToken;
        user.resetPasswordTokenExpiresAt=resetTokenExpiresAt;
        await user.save();

        //Send Reset Password Email
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`)

        return res.status(200).json({
            success:true,
            message:"Reset Link sent to your email"
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    } 
}

export const resetPassword = async (req:Request,res:Response)=>{
    try {
        const {token} = req.params;
        const {newPassword} = req.body;
        const user= await User.findOne({resetPasswordToken:token, resetPasswordTokenExpiresAt:{$gt:Date.now()}});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or Token Expired"
            });
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        user.resetPasswordToken=undefined;
        user.resetPasswordTokenExpiresAt=undefined;
        await user.save();

        //Successfull Email 
        await sendResetSuccessEmail(user.email);
        
        return res.status(200).json({
            success:true, 
            message:"Password reset successfully"
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    } 
}

export const checkAuth = async (req:Request,res:Response)=>{
    try {
        const userId=req.id;
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:'User Not found'
            });
        };
        return res.status(200).json({
            success:true,
            user
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    } 
}

export const updateProfile= async (req:Request,res:Response)=>{
    try {
        const userId=req.id;
        const {fullname, email, address, city, country, profilePicture} =req.body;
        
        //cloudinary
        let cloudResponse:any;
        cloudResponse=await cloudinary.uploader.upload(profilePicture);
        const updatedData={fullname, email, address, city, country, profilePicture};
        
        const user= await User.findByIdAndUpdate(userId,updatedData,{new:true}).select("-password");
        return res.status(200).json({
            success:true,
            user,
            message:"Profile updated successfully"
        }); 
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}