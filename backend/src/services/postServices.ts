import {prisma} from "../../lib/prisma";
import type {PostWithUser} from "../types/Post";
export const postServices = {
    createPost: async(text:string, userId:number, postId: number | null, mediaFiles: { url: string, type: "VIDEO" | "IMAGE" }[]):Promise<PostWithUser>=>
        prisma.post.create({
            data: {
                text,
                userId,
                parentId: postId,
                media: {
                    create: mediaFiles
                }
            },
            include:{
                media: {},
                user: {
                    select:{id:true, username: true, displayName:true, avatar:true}
                },
                _count: { select: { replies: true, likes: true } }
            }
        }),
    updatePost: async(postId: number, text:string, keepMediaIds: number[],
                      newMediaFiles: { url: string, type: "VIDEO" | "IMAGE" }[]):Promise<PostWithUser>=>
        prisma.post.update({
            where: {id: postId},
            data:{
                text,
                media: {
                    deleteMany: {
                        postId,
                        id: { notIn: keepMediaIds }
                    },
                    create: newMediaFiles
                }
            },
            include: {
                media: {},
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
                media: {},
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
                media: {},
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
            take: 20
        }),
    getPostsByUserId: async(userId:number, cursorId:number|null):Promise<PostWithUser[]>=>
        prisma.post.findMany({
            where:{
                parentId: null,
                userId,
                ...(cursorId ? {id: {lt: cursorId}} :{})
            },
            include:{
                media: {},
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
            take: 20
        }),
    getPostReplies: async(postId: number, userId: number | null, cursorId:number|null)=>
        prisma.post.findMany({
            where: {
                parentId: postId,
                ...(cursorId ? {id: {lt: cursorId}} :{})
            },
            include:{
                media: {},
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
            take: 20
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
            media: {},
            user:
                {select:
                        {id:true, username: true, displayName:true, avatar:true}
                },
            likes:userId ? {
                where: { userId },
                select: { id: true }
            } : false,
            _count: { select: { replies: true, likes: true}}
        },
        orderBy: { id: "desc" },
        take: 20
        }),
    findPosts: async(search: string, userId: number, cursorId:number|null):Promise<PostWithUser[]>=>
        prisma.post.findMany({
            where:{
                text: {
                    contains: search,
                    mode:"insensitive"
                },
                ...(cursorId ? { id: { lt: cursorId } } : {})
            },
            include: {
                media: {},
                user:
                    {select:
                            {id:true, username: true, displayName:true, avatar:true}
                    },
                likes:userId ? {
                    where: { userId },
                    select: { id: true }
                } : false,
                _count: { select: { replies: true, likes: true}}
            },
            orderBy: { id: "desc" },
            take: 20
        }),
    // toggleRepost: async(postId: number, userId: number) => {
    //     const targetPost = await prisma.post.findUnique({
    //         where: { id: postId },
    //         select: { repostOfId: true }
    //     });
    //
    //     if (!targetPost) throw new Error("Post not found");
    //
    //     const realPostId = targetPost?.repostOfId ?? postId;
    //
    //     if (targetPost.repostOfId) {
    //         const originalExists = await prisma.post.findUnique({
    //             where: { id: realPostId },
    //             select: { id: true }
    //         });
    //         if (!originalExists) throw new Error("Original post not found");
    //     }
    //
    //     const existing = await prisma.post.findFirst({
    //         where: { userId, repostOfId: realPostId }
    //     });
    //
    //     if (existing) {
    //         await prisma.post.delete({ where: { id: existing.id } });
    //         return { repost: null, isReposted: false };
    //     }
    //
    //     const repost = await prisma.post.create({
    //         data: { userId, text: "", repostOfId: realPostId },
    //         include: {
    //             media: {},
    //             repostOf: {
    //                 include: {
    //                     media: {},
    //                     user: { select: {id:true, username: true, displayName:true, avatar:true} },
    //                     _count: { select: { replies: true, likes: true, reposts: true }}
    //                 }
    //             },
    //             user: { select: {id:true, username: true, displayName:true, avatar:true} },
    //             _count: { select: { replies: true, likes: true, reposts: true } }
    //         }
    //     });
    //
    //     return { repost, isReposted: true };
    // },
}
