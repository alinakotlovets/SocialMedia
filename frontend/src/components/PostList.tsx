import type {Post} from "../types/Post.ts";
import type {User} from "../types/User.ts";
import {PostItem} from "./PostItem.tsx";
import {ParentPost} from "./ParentPost.tsx";

export function PostList({ posts, currentUser, navigate, isReply, onEdit, onDelete}: {
    posts: Post[],
    currentUser: User | null,
    isReply: boolean,
    onEdit: (post: Post) => void,
    onDelete: (id: number) => void,
    navigate: (path: string) => void }) {
    if (posts.length === 0) return <div className="no-posts"><h3>No posts</h3></div>;


    return (
        <ul>
            {!isReply && posts.map(post => (
                <PostItem
                    key={post.id}
                    currentUser={currentUser}
                    post={post}
                    onEdit={onEdit}
                    repliesCount={post._count.replies}
                    onClick={() => navigate(`/post/${post.id}`)}
                    onDelete={(id) => onDelete(id)}
                />
            ))}

            {isReply && posts.map(post=>(
                <ParentPost parentPost={post.parent!}
                            post={post}
                            currentUser={currentUser}
                            onEditParent={onEdit}
                            onDeleteParent={(id)=>onDelete(id)}
                            onEdit={onEdit}
                            onDelete={(id) => onDelete(id)}/>
            ))}
        </ul>
    );
}