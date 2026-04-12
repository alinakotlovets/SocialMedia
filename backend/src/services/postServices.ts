import {prisma} from "../../lib/prisma";
import type {Post} from "../../generated/prisma/client";
import type {PublicUser} from "../types/PublicUser";
type PostWithUser = Post & {user: PublicUser};
export const postServices = {
    createPost: async(text:string, userId:number):Promise<PostWithUser>=>
        prisma.post.create({
            data: {
                text,
                userId
            },
            include:{
                user: {
                    select:{id:true, username: true, displayName:true, avatar:true}
                }
            }
        }),
    updatePost: async(postId: number, text:string):Promise<PostWithUser>=>
        prisma.post.update({
            where: {id: postId},
            data:{text},
            include: {
                user: {
                        select: {id:true, username: true, displayName:true, avatar:true}
                    }
            }
        }),
    getPostById: async(id:number):Promise<PostWithUser | null> =>
        prisma.post.findUnique({
            where:{id},
            include:{
                user:{
                    select: {id:true, username: true, displayName:true, avatar:true}
                }
            }
        }),
    deletePost: async(id:number)=>
    prisma.post.delete({where:{id}}),
    getPosts: async(cursorId: number | null):Promise<PostWithUser[]>=>
        prisma.post.findMany({
            where:{...(cursorId ? {id: {lt: cursorId}} :{})},
            include:{
                user:{
                    select: {id:true, username: true, displayName:true, avatar:true}
                }
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        }),
    getPostsByUserId: async(userId:number, cursorId:number|null):Promise<PostWithUser[]>=>
        prisma.post.findMany({
            where:{
                userId,
                ...(cursorId ? {id: {lt: cursorId}} :{})
            },
            include:{
                user:
                    {select:
                            {id:true, username: true, displayName:true, avatar:true}
                    }
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        }),
}
