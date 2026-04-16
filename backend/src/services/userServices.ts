import {prisma} from "../../lib/prisma";
import type {PublicUser} from "../types/PublicUser";
import type {PostWithUser} from "./postServices";

export const userServices = {
    getUserById: async(id: number):Promise<PublicUser | null> =>
        prisma.user.findUnique({
            where:{id},
            select:{id:true, displayName:true, username:true, avatar:true, description:true}
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
        })
}