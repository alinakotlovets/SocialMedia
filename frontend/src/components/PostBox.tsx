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
    const [errors, setErrors] = useState<string[]>([]);


    const {posts, setPosts} = usePosts();
    async function getPosts(cursorId: number | null) {
        const posts = await Client(`/posts?cursorId=${cursorId}`,"GET");
        if(posts.errors) setErrors(posts.errors);
        if(posts.posts) setPosts(posts.posts);
    }

    useEffect(() => {
        getPosts(null);
    }, []);


    return(
        <div className="post-box">
            {isAddEditPost && (
                <Modal onClose={()=>{setIsAddEditPost(false);
                    setEditingPost(null);}} closeOnOverlayClick={true}>
                    <AddEditPostForm mode={editingPost ? "edit" : "add"}
                                     post={editingPost}
                                     currentUser={currentUser}
                                     onSuccess={(newPost) => {
                                         if (editingPost) {
                                             setPosts(posts.map(p => p.id === newPost.id ? newPost : p));
                                         } else {
                                             setPosts([newPost, ...posts]);
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
                {errors.length>0 &&(
                    <ul>
                        {errors.map((e, i)=>
                            <li key={i}>{e}</li>
                        )}
                    </ul>
                )}
                {posts.length>0 &&(
                    <ul className="post-list">
                        {posts.map((post)=>
                           <PostItem currentUser={currentUser}
                                     post={post}
                                     onEdit={(post) => {
                                         setEditingPost(post);
                                         setIsAddEditPost(true);
                                     }}
                                     onDelete={(id) => setPosts(posts.filter(p => p.id !== id))}
                           />
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}