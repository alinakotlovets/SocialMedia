import type {Request} from "express";
import {AppError} from "./AppError";
export function getUserId(req:Request) {
    if(!req.user) throw new AppError(401, "You are unauthorized");
    return req.user.id;
}
