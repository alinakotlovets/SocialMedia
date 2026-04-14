import type {Request, Response} from "express";
import {getUserId} from "../utils/getUserId";
import {parseId} from "../utils/parseId";
import {likeServices} from "../services/likeServices";
import {postServices} from "../services/postServices";
import {AppError} from "../utils/AppError";

export async function likeUnlikePost(req:Request, res:Response){
    const userId = getUserId(req);

    const postId = parseId(req.params.postId, "Post id");
    const post = await postServices.getPostById(postId);
    if(!post) throw new AppError(404, "post with this id not found");

    const result = await likeServices.likeUnlikePost(userId, postId);
    res.status(200).json({ message: result.liked ? "liked" : "unliked"});
}