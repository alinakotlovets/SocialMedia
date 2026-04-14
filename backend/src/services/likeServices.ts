import {prisma} from "../../lib/prisma";

export const likeServices = {
    likeUnlikePost: async (userId: number, postId: number) => {
        return prisma.$transaction(async (tx) => {
            const like = await tx.like.findUnique({
                where: {
                    postId_userId: { postId, userId }
                }
            });

            if (!like) {
                await tx.like.create({ data: { postId, userId } });
                return { liked: true };
            } else {
                await tx.like.delete({ where: { id: like.id } });
                return { liked: false };
            }
        });
    }
}
