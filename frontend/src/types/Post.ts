import type {User} from "./User.ts";
type Likes = {"id": number};
export type Post ={
    id: number,
    text: string
    createdAt: string,
    editedAt: string,
    userId: number,
    "parentId": number | null,
    "_count": {
        "likes": number,
        "replies": number
    }
    likes:Likes[],
    user: User
}