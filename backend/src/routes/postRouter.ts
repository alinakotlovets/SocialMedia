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
    getPostById, getFollowingPosts, getSearchPosts
} from "../controllers/postController";
import {upload} from "../utils/multer";
import {validateFiles} from "../middleware/validateFile";

const postRouter = express.Router();


postRouter.get("/following", verifyToken, getFollowingPosts);
postRouter.get("/search", verifyToken, getSearchPosts);
postRouter.delete("/:postId", verifyToken, deletePost);
postRouter.put("/:postId", upload.array("media", 2), validateFiles, verifyToken, postValidation, validateFields, editPost);
// postRouter.post("/repost/:postId",  verifyToken, createRepost);
postRouter.post("/:postId/replies", upload.array("media", 2), validateFiles, verifyToken, postValidation, validateFields, addPost);
postRouter.post("/", upload.array("media", 2), validateFiles, verifyToken, postValidation, validateFields, addPost);
postRouter.get("/:postId/replies", optionalAuth, getPostReplies);
postRouter.get("/:postId", optionalAuth, getPostById);
postRouter.get("/user/:userId", optionalAuth, getUserPost);
postRouter.get("/", optionalAuth, getPosts);
export default postRouter;