import {postServices} from "../services/postServices";
import type {Request, Response} from "express";
import {getUserId} from "../utils/getUserId";
import {parseId} from "../utils/parseId";
import {AppError} from "../utils/AppError";
import {parseOptionalId} from "../utils/parseOptionalId";
import {userServices} from "../services/userServices";
import {uploadFiles} from "../utils/uploadFiles";


export async function addPost(req:Request, res:Response){
    const userId = getUserId(req);
    const {text} = req.body;
    const postId = parseOptionalId(req.params.postId, "Post id ");
    if(postId){
        const post = await postServices.getPostById(postId, userId);
        if(!post) throw new AppError(404, "Post with this id not found");
    }

    const files = (req.files as Express.Multer.File[]) ?? [];
    const media = await uploadFiles(files, "SocialMediaFiles");
    const post = await postServices.createPost(text, userId, postId, media);
    res.status(201).json({post});
}

export async function editPost(req: Request, res: Response) {
    const { text, keepMediaIds } = req.body;
    const parsedKeepIds: number[] = keepMediaIds ? JSON.parse(keepMediaIds) : [];

    const postId = parseId(req.params.postId, "Post id");
    const userId = getUserId(req);

    const postFromDb = await postServices.getPostById(postId, userId);
    if (!postFromDb) throw new AppError(404, "Post with this id not found");
    if (postFromDb.userId !== userId) throw new AppError(403, "You not author of this post");

    const files = (req.files as Express.Multer.File[]) ?? [];

    if (parsedKeepIds.length + files.length > 2) {
        throw new AppError(400, "Maximum 2 media per post");
    }

    const newMedia = await uploadFiles(files, "SocialMediaFiles");
    const post = await postServices.updatePost(postId, text, parsedKeepIds, newMedia);
    res.status(200).json({ post });
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
    const user = await userServices.getUserById(userId, null);
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

export async function getFollowingPosts(req:Request, res:Response){
    const userId = getUserId(req);
    const cursorId = parseOptionalId(req.query.cursorId, "Cursor id ");
    const posts = await postServices.getFollowingPosts(userId, cursorId);
    res.status(200).json({posts});
}

export async function getSearchPosts(req:Request, res:Response){
    const search = req.query.search;
    if(typeof search !== "string") throw new AppError(400, "Search text is invalid");
    if(!search) throw new AppError(400, "Search text is required");
    const userId = getUserId(req);
    const cursorId = parseOptionalId(req.query.cursorId, "Cursor id ");
    const posts =  await  postServices.findPosts(search, userId, cursorId);
    res.status(200).json({posts});
}

// export async function createRepost(req:Request, res:Response){
//     const postId = parseId(req.params.postId, "Post id ");
//     const userId = getUserId(req);
//     try {
//         const result = await postServices.toggleRepost(postId, userId);
//         res.status(200).json(result);
//     } catch (e: any) {
//         res.status(400).json({ errors: [e.message] });
//     }
// }