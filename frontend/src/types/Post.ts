import type {User} from "./User.ts";
export type Post ={
    id: number,
    text: string
    createdAt: string,
    editedAt: string,
    userId: number,
    user: User
}