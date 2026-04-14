import "dotenv/config"
import type {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {AppError} from "../utils/AppError.js";
export function  optionalAuth (req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET_KEY) throw new AppError(500, "No secret key");

    if(token){
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
                id: number;
                username: string;
            };
        } catch {
        }
    }
    next();
}