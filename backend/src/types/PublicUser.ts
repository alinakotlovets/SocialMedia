export type PublicUser = {
    id: number;
    displayName: string;
    username: string;
    avatar: string | null;
    description: string | null
    _count: { followers: number, following: number }
    followers: { id: number }[]
}