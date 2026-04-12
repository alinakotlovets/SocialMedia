import type {Request, Response} from "express";
import {getUserId} from "../utils/getUserId";
import {userServices} from "../services/userServices";

export async function getUser(req:Request, res:Response){
    const userId = getUserId(req);
    const user = await userServices.getUserById(userId);
    res.status(200).json({user});
}