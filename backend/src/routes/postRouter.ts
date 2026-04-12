import express from "express";
import {validateFields} from "../middleware/validateFields";
import {verifyToken} from "../middleware/verifyToken";
import {postValidation} from "../services/postValidation";
import {addPost, editPost, deletePost, getPosts, getUserPost} from "../controllers/postController";

const postRouter = express.Router();


postRouter.delete("/:postId", verifyToken, deletePost);
postRouter.put("/:postId", verifyToken, postValidation, validateFields, editPost);
postRouter.post("/", verifyToken, postValidation, validateFields, addPost);
postRouter.get("/user", verifyToken, getUserPost);
postRouter.get("/", getPosts);
export default postRouter;