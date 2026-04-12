import express from "express";
import {validateRegister, validateLogin} from "../services/authValidation";
import {registerUser, loginUser} from "../controllers/authConrtoller";
import {validateFields} from "../middleware/validateFields";
import {upload} from "../utils/multer";
import {validateImage} from "../middleware/validateImage";

const authRouter = express.Router();

authRouter.post("/login", validateLogin, validateFields, loginUser);
authRouter.post("/register", upload.single("avatar"), validateImage, validateRegister, validateFields, registerUser);
export default authRouter