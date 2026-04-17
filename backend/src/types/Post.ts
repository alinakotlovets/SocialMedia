import type {Post} from "../../generated/prisma/client";
import type {PublicUser} from "./PublicUser";

export type PostAuthor = {
    id: number;
    username: string;
    displayName: string;
    avatar: string | null;
};


export type PostWithUser = Post & {
    user: PostAuthor;
    _count: {
        replies: number;
        likes: number;
    };
    likes?: { id: number }[];
};