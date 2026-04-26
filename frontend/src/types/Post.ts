import type {User} from "./User.ts";
import type {media} from "./Media.ts";
type Likes = {"id": number};
export type Post ={
    id: number,
    text: string
    createdAt: string,
    editedAt: string,
    userId: number,
    parent: Post | null,
    parentId: number | null,
    _count: {
        "likes": number,
        "replies": number,
        "reposts": number
    },
    repostOf?: Post,
    reposts: Likes[],
    repostOfId: number | null,
    likes:Likes[],
    user: User,
    media: media[],
    isReposted: boolean
}