export type User={
    "id": number,
    "displayName": string,
    "username": string,
    "avatar": string | null,
    "description": string | null,
    "_count": {
        "following": number,
        "followers": number
    },
    followers: [
        {
            "id": number
        }
    ]
}