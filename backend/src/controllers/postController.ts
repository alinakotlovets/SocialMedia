import {postServices} from "../services/postServices";
import type {Request, Response} from "express";
import {getUserId} from "../utils/getUserId";
import {parseId} from "../utils/parseId";
import {AppError} from "../utils/AppError";
import {parseOptionalId} from "../utils/parseOptionalId";
import {userServices} from "../services/userServices";

export async function addPost(req:Request, res:Response){
    const userId = getUserId(req);
    const {text} = req.body;
    const postId = parseOptionalId(req.params.postId, "Post id ");
    if(postId){
        const post = await postServices.getPostById(postId, userId);
        if(!post) throw new AppError(404, "Post with this id not found");
    }
    const post = await postServices.createPost(text, userId, postId);
    res.status(201).json({post});
}

export async function editPost(req:Request, res:Response){
    const {text} = req.body;
    const postId = parseId(req.params.postId, "Post id");

    const userId = getUserId(req);
    const postFromDb = await postServices.getPostById(postId, userId);
    if (!postFromDb) throw new AppError(404, "Post with this id not found");
    if(postFromDb.userId !== userId) throw new AppError(403, "You not author of this post");

    const post = await postServices.updatePost(postId, text);
    res.status(200).json({post});
}

export async function deletePost(req:Request, res:Response){
    const postId = parseId(req.params.postId, "Post id");
    const userId = getUserId(req);
    const postFromDb = await postServices.getPostById(postId, userId);
    if (!postFromDb) throw new AppError(404, "Post with this id not found");
    if(postFromDb.userId !== userId) throw new AppError(403, "You not author of this post");

    await postServices.deletePost(postId);
    res.status(200).json({message: "delete successfully"})
}

export async function getPosts(req:Request, res:Response){
    const cursorId = req.query.cursorId ? Number(req.query.cursorId) : null;
    const userId = req.user ? req.user.id : null
    const posts = await postServices.getPosts(cursorId, userId);
    res.status(200).json({posts});
}

export async function getUserPost(req:Request, res:Response){
    const cursorId = req.query.cursorId ? Number(req.query.cursorId) : null;
    const userId = parseId(req.params.userId, "User id ");
    const user = await userServices.getUserById(userId);
    if(!user) throw new AppError(404, "User with this id not found");
    const posts = await postServices.getPostsByUserId(userId, cursorId);
    res.status(200).json({posts});
}

export async function getPostReplies(req:Request, res:Response){
    const postId = parseId(req.params.postId, "Post id ");
    const cursorId = parseOptionalId(req.query.cursorId, "Cursor id ");
    const userId = req.user ? req.user.id : null
    const post = await postServices.getPostById(postId, userId);
    if(!post) throw new AppError(404, "Post not found");
    const replies = await postServices.getPostReplies(postId, userId, cursorId);
    res.status(200).json({replies});
}

export async function getPostById(req:Request, res:Response){
    const postId = parseId(req.params.postId, "Post id ");
    const userId = req.user ? req.user.id : null;
    const post = await postServices.getPostById(postId, userId);
    if(!post) throw new AppError(404, "Post not found");
    res.status(200).json({post});
}