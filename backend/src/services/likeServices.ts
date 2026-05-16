import {prisma} from "../../lib/prisma";

export const likeServices = {
    likeUnlikePost: async (userId: number, postId: number) => {
        const like = await prisma.like.findUnique({
            where: { postId_userId: { postId, userId } }
        });

        if (!like) {
            await prisma.like.create({ data: { postId, userId } });
            return { liked: true };
        } else {
            await prisma.like.delete({ where: { id: like.id } });
            return { liked: false };
        }
    }
}


