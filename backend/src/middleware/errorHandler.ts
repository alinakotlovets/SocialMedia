import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    console.log("Error: ", err);
    let status = 500;
    let errors: string[] = ["Something went wrong"];

    if (err instanceof AppError) {
        status = err.statusCode;
        errors = err.errorsText;
    }

    else if (err instanceof Error) {
        errors = [err.message];
    }

    res.status(status).json({ errors });
}