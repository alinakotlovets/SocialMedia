import type {User} from "../types/User.ts";
import {useEffect, useState} from "react";
import {Modal} from "./ui/Modal.tsx";
import {AddEditPostForm} from "./AddEditPostForm.tsx";
import {PostItem} from "./PostItem.tsx";
import "./PostBox.css"
import type {Post} from "../types/Post.ts";
import Client from "../api/client.ts";

type PostBoxProps = {
    currentUser: User | null
}
export function PostBox({currentUser}:PostBoxProps){
    const [posts, setPosts] = useState<Post[]>([])
    const [isAddEditPost, setIsAddEditPost] =useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

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
                                     setPosts={setPosts}
                                     posts={posts}
                                     setIsAddEditPost={setIsAddEditPost}
                    />
                </Modal>
            )}

            {currentUser &&(
                <div className="whats-new-box">
                    <div className="whats-new-left-box">
                        {currentUser.avatar &&(
                            <img src={currentUser.avatar}
                                 alt={currentUser.username + " avatar"}/>
                        )}
                        <p className="text-s text-grey"
                           onClick={()=>setIsAddEditPost(true)}>Whats new?</p>
                    </div>
                    <button className="button button-md button-outline"
                        onClick={()=>setIsAddEditPost(true)}>Post</button>
                </div>
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