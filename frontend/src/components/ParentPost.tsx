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
    repliesCount?: number,
    setActiveVideoId: (value: number) => void,
    activeVideoId:number | null,
}
export function ParentPost({parentPost, post, currentUser, onEditParent, onDeleteParent,
                               onEdit, onDelete, repliesCount, activeVideoId, setActiveVideoId}:ParentPostProps){
    return(<>
        {parentPost && (
            <PostItem
                currentUser={currentUser}
                post={parentPost}
                onEdit={onEditParent}
                setActiveVideoId={setActiveVideoId}
                activeVideoId={activeVideoId}
                onDelete={onDeleteParent}
                repliesCount={parentPost._count.replies}
                hasThread={true}
            />
        )}
        {post && (
            <PostItem currentUser={currentUser}
                      key={post.id}
                      setActiveVideoId={setActiveVideoId}
                      activeVideoId={activeVideoId}
                      post={post}
                      onEdit={onEdit}
                      sonHasThread={true}
                      repliesCount={repliesCount}
                      onDelete={onDelete}/>
        )}
    </>)
}