import type {Request, Response} from "express";
import {getUserId} from "../utils/getUserId";
import {userServices} from "../services/userServices";
import {parseId} from "../utils/parseId";
import {AppError} from "../utils/AppError";
import {parseOptionalId} from "../utils/parseOptionalId";
import {uploadImage} from "../utils/uploadImage";

export async function getCurrentUser(req:Request, res:Response){
    const userId = getUserId(req);
    const user = await userServices.getUserById(userId, null);
    res.status(200).json({user});
}

export async function getUserById(req:Request, res:Response){
    const userId = parseId(req.params.userId, "User id ");
    const currentUserId =  parseOptionalId(req.user?.id, "User id ");
    const user = await userServices.getUserById(userId, currentUserId);
    if(!user) throw new AppError(404, "User not found");
    res.status(200).json({user});
}

export async function getUserLikesPost(req:Request, res:Response){
    const userId = parseId(req.params.userId, "User id ");
    const cursorId = parseOptionalId(req.query.cursorId, "Cursor id");
    const currentUser = parseOptionalId(req.user?.id, "User id ");
    const user = await userServices.getUserById(userId, null);
    if(!user) throw new AppError(404, "User with this id not found");
    const posts =  await userServices.getLikedPostsByUserId(userId, cursorId, currentUser);
    res.status(200).json({posts});
}

export async function getUserReplies(req:Request, res:Response){
    const userId = parseId(req.params.userId, "User id ");
    const cursorId = parseOptionalId(req.query.cursorId, "Cursor id");
    const currentUser = parseOptionalId(req.user?.id, "User id ");
    const user = await userServices.getUserById(userId, null);
    if(!user) throw new AppError(404, "User with this id not found");
    const posts =  await userServices.getUserReplies(userId, cursorId, currentUser);
    res.status(200).json({posts});
}

export async function editUser(req:Request, res:Response){
    const {displayName, description} = req.body;
    const userId = parseId(req.params.userId, "User id");
    const currentUserId = getUserId(req);
    if(userId !== currentUserId) throw  new AppError(403, "You dont have permission to edit this user");
    const user = await userServices.getUserById(userId, null);
    if(!user) throw new AppError(404, "User with this id not found");
    let avatar= await uploadImage(req.file, "messenger-users");
    if( avatar === null && user.avatar !== null) avatar = user.avatar;
    const updatedUser = await userServices.editUser(userId, displayName,description,avatar,currentUserId);
    res.status(200).json({user: updatedUser})
}

export async function findUsers(req:Request, res:Response){
    const search = req.query.search;
    if(!search) throw new AppError(400, "Search text is required");
    if(typeof search !== "string") throw new AppError(400, "Search format is invalid");
    const currentUserId = getUserId(req);
    const cursorId = parseOptionalId(req.params.cursorId, "Cursor id ");
    const users = await userServices.findUsers(search, currentUserId, cursorId);
    res.status(200).json({users});
}