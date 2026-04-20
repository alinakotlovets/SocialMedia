import express from "express";
import {verifyToken} from "../middleware/verifyToken";
import {
    editUser,
    findUsers,
    getCurrentUser,
    getUserById,
    getUserLikesPost,
    getUserReplies
} from "../controllers/userControllers";
import {optionalAuth} from "../middleware/optionalAuth";
import {upload} from "../utils/multer";
import {validateImage} from "../middleware/validateImage";
import {validateEditUser} from "../services/userValidation";
import {validateFields} from "../middleware/validateFields";

const userRouter = express.Router();

userRouter.post("/:userId", upload.single("avatar"), validateImage, verifyToken,
    validateEditUser, validateFields, editUser);
userRouter.get("/search", verifyToken, findUsers);
userRouter.get("/:userId/replies", optionalAuth, getUserReplies);
userRouter.get("/:userId/liked-posts", optionalAuth, getUserLikesPost);
userRouter.get("/:userId", optionalAuth, getUserById);
userRouter.get("/", verifyToken, getCurrentUser);

export default userRouter;