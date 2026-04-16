import type {Request, Response} from "express";
import {getUserId} from "../utils/getUserId";
import {userServices} from "../services/userServices";
import {parseId} from "../utils/parseId";
import {AppError} from "../utils/AppError";
import {parseOptionalId} from "../utils/parseOptionalId";
import {postServices} from "../services/postServices";

export async function getCurrentUser(req:Request, res:Response){
    const userId = getUserId(req);
    const user = await userServices.getUserById(userId);
    res.status(200).json({user});
}

export async function getUserById(req:Request, res:Response){
    const userId = parseId(req.params.userId, "User id ");
    const user = await userServices.getUserById(userId);
    if(!user) throw new AppError(404, "User not found");
    res.status(200).json({user});
}

export async function getUserLikesPost(req:Request, res:Response){
    const userId = parseId(req.params.userId, "User id ");
    const cursorId = parseOptionalId(req.query.cursorId, "Cursor id");
    const currentUser = parseOptionalId(req.user?.id, "User id ");
    const user = await userServices.getUserById(userId);
    if(!user) throw new AppError(404, "User with this id not found");
    const posts =  await userServices.getLikedPostsByUserId(userId, cursorId, currentUser);
    res.status(200).json({posts});
}

export async function getUserReplies(req:Request, res:Response){
    const userId = parseId(req.params.userId, "User id ");
    const cursorId = parseOptionalId(req.query.cursorId, "Cursor id");
    const currentUser = parseOptionalId(req.user?.id, "User id ");
    const user = await userServices.getUserById(userId);
    if(!user) throw new AppError(404, "User with this id not found");
    const posts =  await userServices.getUserReplies(userId, cursorId, currentUser);
    res.status(200).json({posts});
}