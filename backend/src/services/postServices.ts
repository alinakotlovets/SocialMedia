import {prisma} from "../../lib/prisma";
import type {PostWithUser} from "../types/Post";
export const postServices = {
    createPost: async(text:string, userId:number, postId: number | null):Promise<PostWithUser>=>
        prisma.post.create({
            data: {
                text,
                userId,
                parentId: postId
            },
            include:{
                user: {
                    select:{id:true, username: true, displayName:true, avatar:true}
                },
                _count: { select: { replies: true, likes: true } }
            }
        }),
    updatePost: async(postId: number, text:string):Promise<PostWithUser>=>
        prisma.post.update({
            where: {id: postId},
            data:{text},
            include: {
                user: {
                        select: {id:true, username: true, displayName:true, avatar:true}
                    },
                _count: { select: { replies: true, likes: true } }
            }
        }),
    getPostById: async(id:number, userId: number | null):Promise<PostWithUser | null> =>
        prisma.post.findUnique({
            where:{id},
            include:{
                user:
                    {select:
                            {id:true, username: true, displayName:true, avatar:true}
                    },
                likes:userId ? {
                    where: { userId },
                    select: { id: true }
                } : false,
                _count: { select: { replies: true, likes: true } }
            }
        }),
    deletePost: async(id:number)=>
    prisma.post.delete({where:{id}}),
    getPosts: async(cursorId: number | null, userId:number | null):Promise<PostWithUser[]>=>
        prisma.post.findMany({
            where:{
                parentId: null,
                ...(cursorId ? {id: {lt: cursorId}} :{})
            },
            include:{
                user:{
                    select: {id:true, username: true, displayName:true, avatar:true}
                },
                likes: userId ? {
                    where: { userId },
                    select: { id: true }
                } : false,
                _count: { select: { replies: true, likes: true } }
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        }),
    getPostsByUserId: async(userId:number, cursorId:number|null):Promise<PostWithUser[]>=>
        prisma.post.findMany({
            where:{
                parentId: null,
                userId,
                ...(cursorId ? {id: {lt: cursorId}} :{})
            },
            include:{
                user:
                    {select:
                            {id:true, username: true, displayName:true, avatar:true}
                    },
                likes: {
                    where: { userId },
                    select: { id: true }
                },
                _count: { select: { replies: true, likes: true } }
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        }),
    getPostReplies: async(postId: number, userId: number | null, cursorId:number|null)=>
        prisma.post.findMany({
            where: {
                parentId: postId,
                ...(cursorId ? {id: {lt: cursorId}} :{})
            },
            include:{
                user:
                    {select:
                            {id:true, username: true, displayName:true, avatar:true}
                    },
                likes:userId ? {
                    where: { userId },
                    select: { id: true }
                } : false,
                _count: { select: { replies: true, likes: true } }
            },
            orderBy: {
                id: "asc"
            },
            take: 50
        }),
    getFollowingPosts: async(userId:number, cursorId:number|null):Promise<PostWithUser[]> =>
    prisma.post.findMany({
        where: {
            parentId: null,
            user: {
                followers: {
                    some: {
                        followerId: userId
                    }
                }
            },
            ...(cursorId ? { id: { lt: cursorId } } : {})
            },
        include: {
            user:
                {select:
                        {id:true, username: true, displayName:true, avatar:true}
                },
            likes:userId ? {
                where: { userId },
                select: { id: true }
            } : false,
            _count: { select: { replies: true, likes: true } }
        },
        orderBy: { id: "desc" },
        take: 50
        }),
    findPosts: async(search: string, userId: number, cursorId:number|null):Promise<PostWithUser[]>=>
        prisma.post.findMany({
            where:{
                text: {
                    contains: search,
                    mode:"insensitive"
                }
            },
            include: {
                user:
                    {select:
                            {id:true, username: true, displayName:true, avatar:true}
                    },
                likes:userId ? {
                    where: { userId },
                    select: { id: true }
                } : false,
                _count: { select: { replies: true, likes: true } }
            },
            orderBy: { id: "desc" },
            take: 50
        })
}
