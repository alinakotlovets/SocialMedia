import {PostItem} from "./PostItem.tsx";
import type {Post} from "../types/Post.ts";
import type {User} from "../types/User.ts";


type ParentPostProps={
    parentPost: Post,
    post: Post | null,
    currentUser: User|null,
    onEditParent: (value:Post)=>void,
    onDeleteParent: (id: number)=>void,
    onEdit: (post: Post) => void,
    onDelete: (id: number) => void,
    repliesCount?: number
}
export function ParentPost({parentPost, post, currentUser, onEditParent, onDeleteParent,
                               onEdit, onDelete, repliesCount}:ParentPostProps){
    return(<>
        {parentPost && (
            <PostItem
                currentUser={currentUser}
                post={parentPost}
                onEdit={onEditParent}
                onDelete={onDeleteParent}
                repliesCount={parentPost._count.replies}
                hasThread={true}
            />
        )}
        {post && (
            <PostItem currentUser={currentUser}
                      post={post}
                      onEdit={onEdit}
                      repliesCount={repliesCount}
                      onDelete={onDelete}/>
        )}
    </>)
}