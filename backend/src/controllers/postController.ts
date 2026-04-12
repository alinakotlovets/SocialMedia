import {postServices} from "../services/postServices";
import type {Request, Response} from "express";
import {getUserId} from "../utils/getUserId";
import {parseId} from "../utils/parseId";
import {AppError} from "../utils/AppError";

export async function addPost(req:Request, res:Response){
    const userId = getUserId(req);
    const {text} = req.body;
    const post = await postServices.createPost(text, userId);
    res.status(201).json({post});
}

export async function editPost(req:Request, res:Response){
    const {text} = req.body;
    const postId = parseId(req.params.postId, "Post id");

    const userId = getUserId(req);
    const postFromDb = await postServices.getPostById(postId);
    if (!postFromDb) throw new AppError(404, "Post with this id not found");
    if(postFromDb.userId !== userId) throw new AppError(403, "You not author of this post");

    const post = await postServices.updatePost(postId, text);
    res.status(200).json({post});
}

export async function deletePost(req:Request, res:Response){
    const postId = parseId(req.params.postId, "Post id");
    const userId = getUserId(req);
    const postFromDb = await postServices.getPostById(postId);
    if (!postFromDb) throw new AppError(404, "Post with this id not found");
    if(postFromDb.userId !== userId) throw new AppError(403, "You not author of this post");

    await postServices.deletePost(postId);
    res.status(200).json({message: "delete successfully"})
}

export async function getPosts(req:Request, res:Response){
    const cursorId = req.query.cursorId ? Number(req.query.cursorId) : null;
    const posts = await postServices.getPosts(cursorId);
    res.status(200).json({posts});
}

export async function getUserPost(req:Request, res:Response){
    const cursorId = req.query.cursorId ? Number(req.query.cursorId) : null;
    const userId = getUserId(req);
    const posts = await postServices.getPostsByUserId(userId, cursorId);
    res.status(200).json({posts});
}