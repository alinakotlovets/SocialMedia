import {prisma} from "../../lib/prisma";
import type {PublicUser} from "../types/PublicUser";
import type {PostWithUser} from "../types/Post";

export const userServices = {
    getUserById: async(id: number, currentUserId: number | null):Promise<PublicUser | null> =>
        prisma.user.findUnique({
            where:{id},
            select:{id:true, displayName:true, username:true, avatar:true, description:true,
                _count: { select: { following: true, followers: true }},
                followers: currentUserId ? {
                    where: { followerId: currentUserId },
                    select: { id: true }
                } : false
            },
        }),
    getLikedPostsByUserId: async (userId: number, cursorId: number | null, currentUserId: number | null): Promise<PostWithUser[]> =>
        prisma.like.findMany({
            where: {
                userId,
                ...(cursorId ? { id: { lt: cursorId } } : {})
            },
            include: {
                post: {
                    include: {
                        media: {},
                        user: {
                            select: { id: true, username: true, displayName: true, avatar: true }
                        },
                        likes: currentUserId ? {
                            where: { userId: currentUserId },
                            select: { id: true }
                        } : false,
                        _count: { select: { replies: true, likes: true } }
                    }
                }
            },
            orderBy: { id: "desc" },
            take: 50
        }).then(likes => likes.map(l => l.post)),
    getUserReplies: async (userId: number, cursorId: number | null, currentUserId: number | null): Promise<PostWithUser[]> =>
        prisma.post.findMany({
            where: {
                userId,
                parentId: { not: null },
                ...(cursorId ? { id: { lt: cursorId } } : {})
            },
            include: {
                user: {
                    select: { id: true, username: true, displayName: true, avatar: true }
                },
                parent: {
                    include: {
                        media: {},
                        user: {
                            select: { id: true, username: true, displayName: true, avatar: true }
                        },
                        _count: { select: { replies: true, likes: true } }
                    }
                },
                likes: currentUserId ? {
                    where: { userId: currentUserId },
                    select: { id: true }
                } : false,
                _count: { select: { replies: true, likes: true }}
                },
            orderBy: { id: "desc" },
            take: 50
        }),
    editUser: async(userId:number, displayName:string, description:string,
                    avatar:string | null, currentUserId:number | null):Promise<PublicUser> =>
        prisma.user.update({
            where:{id:userId},
            data:{displayName, description,avatar},
            select:{id:true, displayName:true, username:true, avatar:true, description:true,
                _count: { select: { following: true, followers: true }},
                followers: currentUserId ? {
                    where: { followerId: currentUserId },
                    select: { id: true }
                } : false
            },
        }),
    findUsers: async(search:string, currentUserId: number | null, cursorId:number|null):Promise<PublicUser[]> =>
        prisma.user.findMany({
            where:{
                OR: [
                    { username: { contains: search, mode: 'insensitive' } },
                    { displayName: { contains: search, mode: 'insensitive' } }
                ]
            },
            select:{id:true, displayName:true, username:true, avatar:true, description:true,
                _count: { select: { following: true, followers: true }},
                followers: currentUserId ? {
                    where: { followerId: currentUserId },
                    select: { id: true }
                } : false
            },
            orderBy: { id: "desc" },
            take: 10
        })
}