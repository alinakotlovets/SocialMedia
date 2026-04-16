import express from "express";
import {validateFields} from "../middleware/validateFields";
import {verifyToken} from "../middleware/verifyToken";
import {optionalAuth} from "../middleware/optionalAuth";
import {postValidation} from "../services/postValidation";
import {
    addPost,
    editPost,
    deletePost,
    getPosts,
    getUserPost,
    getPostReplies,
    getPostById
} from "../controllers/postController";

const postRouter = express.Router();


postRouter.delete("/:postId", verifyToken, deletePost);
postRouter.put("/:postId", verifyToken, postValidation, validateFields, editPost);
postRouter.post("/:postId/replies",verifyToken, postValidation, validateFields, addPost);
postRouter.post("/", verifyToken, postValidation, validateFields, addPost);
postRouter.get("/:postId/replies", optionalAuth, getPostReplies);
postRouter.get("/:postId", optionalAuth, getPostById);
postRouter.get("/user/:userId", optionalAuth, getUserPost);
postRouter.get("/", optionalAuth, getPosts);
export default postRouter;