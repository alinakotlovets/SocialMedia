import express from "express";
import {verifyToken} from "../middleware/verifyToken";
import {getUser} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/", verifyToken, getUser);

export default userRouter;