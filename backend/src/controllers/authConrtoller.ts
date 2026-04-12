import type {Request, Response} from "express";
import bcrypt from "bcrypt";
import {authServices} from "../services/authServices";
import {AppError} from "../utils/AppError";
import {uploadImage} from "../utils/uploadImage";
import jwt from "jsonwebtoken";

export async function registerUser(req: Request, res:Response){
    const {username, displayName, email, password, description} = req.body;

    const existingUser = await authServices.existingUser(username, email);
    if (existingUser) {
        if (existingUser.username === username) {
            throw new AppError(400, "User with this username already exists");
        }
        if (existingUser.email === email) {
            throw new AppError(400, "User with this email already exists");
        }
    }

    let hashedPassword: string | null = null;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    const avatar = await uploadImage(req.file, "SocialMediaUsers");
    const user = await authServices.addUser(username, displayName, email, hashedPassword, description, avatar);

    res.status(201).json({user:{
            id:user.id,
            username: user.username,
            displayName: user.displayName,
            avatar:user.avatar
    }})
}

export async function loginUser(req:Request, res:Response){
    const {login, password} = req.body;

    const user = await authServices.getUserByLogin(login);
    if(!user) throw new AppError(404, "User with this login not found");
    if(user.password){
        const passwordMatch  = await bcrypt.compare(password, user.password);
        if(!passwordMatch) throw new AppError(400, "Password is incorrect");

        if (!process.env.JWT_SECRET_KEY) throw new AppError(501, "No secret key");
        const token = jwt.sign( {id: user.id, username: user.username},
            process.env.JWT_SECRET_KEY, { expiresIn: "5d" });
        return res.status(200).json({token});
    }
}