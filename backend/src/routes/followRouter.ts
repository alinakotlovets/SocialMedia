import express from "express";
import {verifyToken} from "../middleware/verifyToken";
import {followOrUnfollow, getFollowers, getFollowing} from "../controllers/followController";

const followRouter = express.Router();

followRouter.get("/:userId/following", verifyToken, getFollowing)
followRouter.get("/:userId/followers", verifyToken, getFollowers);
followRouter.post("/:followingUserId", verifyToken, followOrUnfollow);
export default followRouter