import type {Post} from "../types/Post.ts";
import type {User} from "../types/User.ts";
import {useState} from "react";
import defaultAvatar from "../assets/defaultAvatar.png";
import Client from "../api/client.ts";

type AddEditPostFormProps={
    mode: "add" | "edit",
    post: Post | null,
    currentUser: User | null,
    setPosts: (value: Post[])=>void,
    posts: Post[],
    setIsAddEditPost: (value: boolean)=>void
}
export function AddEditPostForm({mode, post, currentUser, setPosts, posts,
                                    setIsAddEditPost}:AddEditPostFormProps){
    if (!currentUser) return null;
    console.log(post);
    const [inputValue, setInputValue] = useState(post?.text ?? "");
    const [errors, setErrors] = useState<string[]>([]);
    async function handleAddEditPost() {
        setErrors([]);
        if (mode === "add"){
            const result = await Client("/posts",
                "POST", JSON.stringify({"text": inputValue}));

            if(result.errors) setErrors(result.errors);

            if(result.post){
                const newPost = [result.post,...posts];
                setPosts(newPost);
                setInputValue("");
                setIsAddEditPost(false);
            }
        }
        if (mode === "edit" && post) {
            const result = await Client(`/posts/${post.id}`,
                "PUT", JSON.stringify({text: inputValue}));
            if (result.errors) setErrors(result.errors);
            if (result.post) {
                setPosts(posts.map(p => p.id === post.id ? result.post : p));
                setIsAddEditPost(false);
            }
        }
    }

    return(
        <div>
                <div className="whats-new-left-box">
                    <img src={currentUser.avatar || defaultAvatar}
                         alt={currentUser.username + " avatar"}/>
                </div>
                <textarea
                       value={inputValue}
                       onChange={(e)=>setInputValue(e.target.value)}/>
                <button className="button button-md button-outline" onClick={handleAddEditPost}>Post</button>
            {errors.length>0 &&(
                <ul>
                    {errors.map((e, i)=>
                    <li key={i}>{e}</li>
                    )}
                </ul>
            )}
        </div>
    )
}