import "dotenv/config"
import express from "express";
import {errorHandler} from "./middleware/errorHandler";
import authRouter from "./routes/authRouter";
import cors from "cors";
import postRouter from "./routes/postRouter";
import userRouter from "./routes/userRouter";
import likeRouter from "./routes/likeRouter";

const app = express();

app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = 3000;

app.use("/posts", postRouter);
app.use("/like", likeRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(port, ()=>{
    console.log("App listening on http://localhost:3000/")
})