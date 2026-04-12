import {prisma} from "../../lib/prisma";
import type {PublicUser} from "../types/PublicUser";

export const userServices = {
    getUserById: async(id: number):Promise<PublicUser | null> =>
        prisma.user.findUnique({
            where:{id},
            select:{id:true, displayName:true, username:true, avatar:true}
        })
}