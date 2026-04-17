import type {Request, Response} from "express";
import {getUserId} from "../utils/getUserId";
import {parseId} from "../utils/parseId";
import {followServices} from "../services/followServices";
import {userServices} from "../services/userServices";
import {AppError} from "../utils/AppError";
import {parseOptionalId} from "../utils/parseOptionalId";


export async function followOrUnfollow(req:Request, res:Response){
    const currentUserId = getUserId(req);
    const followingUserId =  parseId(req.params.followingUserId, "Following user id ");

    if (currentUserId === followingUserId) throw new AppError(400, "You cant follow yourself");

    const user = await userServices.getUserById(followingUserId, null);
    if(!user) throw new AppError(404, "User you trying to follow not found");

    const result = await followServices.followUnfollow(currentUserId, followingUserId);
    res.status(200).json({message: result.follow ? "follow" : "unfollow"})
}

export async function getFollowers(req:Request, res:Response){
    const userId = parseId(req.params.userId, "User id ");
    const cursorId = parseOptionalId(req.query.cursorId, "Cursor id");
    const currentUserId =  getUserId(req);
    const followers = await followServices.getUserFollowers(userId,cursorId, currentUserId);
    res.status(200).json({followers});
}

export async function getFollowing(req:Request, res:Response){
    const userId = parseId(req.params.userId, "User id ");
    const cursorId = parseOptionalId(req.query.cursorId, "Cursor id");
    const currentUserId =  getUserId(req);
    const following = await followServices.getUserFollowing(userId,cursorId, currentUserId);
    res.status(200).json({following});
}