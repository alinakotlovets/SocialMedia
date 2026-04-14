import express from "express";
import {verifyToken} from "../middleware/verifyToken";
import {likeUnlikePost} from "../controllers/likeController";


const likeRouter = express.Router();

likeRouter.post("/:postId", verifyToken, likeUnlikePost);

export default likeRouter;