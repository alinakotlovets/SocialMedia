import type {User} from "../types/User.ts";
import {useEffect, useState} from "react";
import {Modal} from "./ui/Modal.tsx";
import {AddEditPostForm} from "./AddEditPostForm.tsx";
import {PostItem} from "./PostItem.tsx";
import {WhatsNewBox} from "./WhatsNewBox.tsx";
import "./PostBox.css"
import type {Post} from "../types/Post.ts";
import Client from "../api/client.ts";
import {usePosts} from "../context/PostsContext.tsx";

type PostBoxProps = {
    currentUser: User | null
}
export function PostBox({currentUser}:PostBoxProps){
    const [isAddEditPost, setIsAddEditPost] =useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [errors, setErrors] = useState<{posts: string[], following:string[]}>({posts:[], following:[]});
    const [following, setFollowing] = useState<Post[]>([]);
    const [feedType, setFeedType] = useState<"posts" | "following">("posts")

    const {posts, setPosts} = usePosts();
    async function getPosts(cursorId: number | null) {
        const url = cursorId ? `/posts?cursorId=${cursorId}` : "/posts";
        const posts = await Client(url,"GET");
        if(posts.errors) setErrors((prev)=>({...prev, posts:posts.errors}));
        if(posts.posts) setPosts(posts.posts);
    }

    async function getFollowingPosts(cursorId: number |null){
        const url = cursorId ? `/posts/following?cursorId=${cursorId}` : `/posts/following`;
        const response = await Client(url, "GET");
        if (response.errors) setErrors((prev)=>({...prev, followingPosts:response.errors}));
        if (response.posts) setFollowing(response.posts);
    }

    useEffect(() => {
        getPosts(null);
        getFollowingPosts(null);
    }, []);

    const activePosts = feedType === "posts" ? posts : following;
    const setActivePosts = feedType === "posts" ? setPosts : setFollowing;

    return(
        <div  className="post-box">
            {currentUser &&(
                <div className="feed-btn-box">
                    <button className={feedType === "posts" ? "active" : ""}
                        onClick={()=>setFeedType("posts")}>For you</button>
                    <button className={feedType === "following" ? "active" : ""}
                        onClick={()=>setFeedType("following")}>Following</button>
                </div>
            )}
            <div >
            {isAddEditPost && (
                <Modal onClose={()=>{setIsAddEditPost(false);
                    setEditingPost(null);}} closeOnOverlayClick={true}>
                    <AddEditPostForm mode={editingPost ? "edit" : "add"}
                                     post={editingPost}
                                     currentUser={currentUser}
                                     onSuccess={(newPost) => {
                                         if (editingPost) {
                                             setActivePosts(posts.map(p => p.id === newPost.id ? newPost : p));
                                         } else {
                                             setActivePosts([newPost, ...posts]);
                                         }
                                         setEditingPost(null);
                                     }}
                                     setIsAddEditPost={setIsAddEditPost}
                    />
                </Modal>
            )}

            {currentUser &&(
                <WhatsNewBox currentUser={currentUser} text={"Whats new?"} onClick={()=>setIsAddEditPost(true)}/>
            )}

            <div>
                {errors[feedType].length>0 &&(
                    <ul>
                        {errors[feedType].map((e, i)=>
                            <li key={i}>{e}</li>
                        )}
                    </ul>
                )}
                {activePosts.length>0 &&(
                    <ul className="post-list">
                        {activePosts.map((post)=>
                           <PostItem currentUser={currentUser}
                                     post={post}
                                     repliesCount={post._count.replies}
                                     onEdit={(post) => {
                                         setEditingPost(post);
                                         setIsAddEditPost(true);
                                     }}
                                     onDelete={(id) => setActivePosts(posts.filter(p => p.id !== id))}
                           />
                        )}
                    </ul>
                )}
            </div>
        </div>
        </div>
    )
}