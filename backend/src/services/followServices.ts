import {prisma} from "../../lib/prisma";


export const followServices = {
    followUnfollow: async(followerId:number, followingId:number)=>{
     return prisma.$transaction(async (tx)=>{
         const follow = await tx.follow.findUnique(
             {
                 where:{
                     followerId_followingId :{followerId, followingId}
                 }
             });
         if (!follow){
             await prisma.follow.create({data:{followerId, followingId}})
             return {follow: true}
         } else {
             await prisma.follow.delete({where:{ id: follow.id}})
             return {follow: false}
         }
     })
    },
    getUserFollowers: async (userId: number, cursorId: number | null, currentUserId: number | null) =>
    { const follows = await prisma.follow.findMany({
            where: {
                followingId: userId,
                ...(cursorId ? { id: { lt: cursorId } } : {})
            },
            include: {
                follower: {
                    select: {id: true, username: true, displayName: true, avatar: true,
                        followers: currentUserId ? {
                            where: { followerId: currentUserId },
                            select: { id: true }
                        } : false
                    }
                }
            },
            orderBy: { id: "desc" },
            take: 50
        })
        return follows.map(f => ({
            ...f.follower,
            isFollowed: f.follower.followers.length > 0
        }))
    },
    getUserFollowing: async(userId: number, cursorId: number | null, currentUserId: number | null)=>
    { const follows = await prisma.follow.findMany({
            where: {
                followerId: userId,
                ...(cursorId ? { id: { lt: cursorId } } : {})
            },
            include:{
                following:{
                    select: {id: true, username: true, displayName: true, avatar: true,
                        followers: currentUserId ? {
                            where: { followerId: currentUserId },
                            select: { id: true }
                        } : false
                    }
                }
            },
            orderBy: { id: "desc" },
            take: 50
        })
        return follows.map(f => ({
            ...f.following,
            isFollowed: f.following.followers.length > 0
        }))

    }
}