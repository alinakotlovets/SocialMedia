import type {Request, Response, NextFunction} from "express";
import {AppError} from "../utils/AppError.js";

export async function validateFiles(req: Request, res: Response, next: NextFunction) {
    const files = (req.files as Express.Multer.File[]) ?? [];
    const maxSize = 5 * 1024 * 1024;

    if (files.length > 2) {
        throw new AppError(400, "Maximum 2 media files per post");
    }

    for (const file of files) {
        if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
            throw new AppError(400, "Type of file is not supported. Only images or video are allowed");
        }
        if (file.size > maxSize) {
            throw new AppError(400, "Size of file too big (max 5MB)");
        }
    }

    next();
}