import express from "express";
import {verifyToken} from "../middleware/verifyToken";
import {getCurrentUser, getUserById, getUserLikesPost, getUserReplies} from "../controllers/userControllers";
import {optionalAuth} from "../middleware/optionalAuth";

const userRouter = express.Router();

userRouter.get("/:userId/replies", optionalAuth, getUserReplies);
userRouter.get("/:userId/liked-posts", optionalAuth, getUserLikesPost);
userRouter.get("/:userId", optionalAuth, getUserById);
userRouter.get("/", verifyToken, getCurrentUser);

export default userRouter;