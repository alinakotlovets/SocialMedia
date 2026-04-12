import {prisma} from "../../lib/prisma";
import type {User} from "../../generated/prisma/client";

export const authServices = {
    addUser: async(username: string, displayName: string, email: string, password:string|null,
                   description: string|null, avatar:string|null):Promise<User> =>
        prisma.user.create({data:{username, displayName, description,email, password, avatar}}),
    getUserById: async(userId: number):Promise<User | null> =>
        prisma.user.findUnique({where:{id: userId}}),
    existingUser: async(username:string, email:string):Promise<User|null> =>
        prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        }),
    getUserByLogin: async (login: string): Promise<User | null> =>
        prisma.user.findFirst({
            where: {
                OR: [
                    { username: login },
                    { email: login }
                ]
            }
        }),
}