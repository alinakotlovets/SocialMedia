import type {Post} from "../types/Post.ts";
import type {User} from "../types/User.ts";
import {useState} from "react";
import defaultAvatar from "../assets/defaultAvatar.png";
import Client from "../api/client.ts";
import "./AddEditPostForm.css"

type AddEditPostFormProps={
    mode: "add" | "edit" | "reply",
    post: Post | null,
    currentUser: User | null,
    onSuccess: (post: Post) => void,
    setIsAddEditPost: (value: boolean)=>void
}
export function AddEditPostForm({mode, post, currentUser, onSuccess,
                                    setIsAddEditPost}:AddEditPostFormProps){
    if (!currentUser) return null;
    const [inputValue, setInputValue] = useState((mode === "edit" && post?.text) ? post?.text : "");
    const [errors, setErrors] = useState<string[]>([]);
    async function handleAddEditPost() {
        setErrors([]);
        if (mode === "add"){
            const result = await Client("/posts",
                "POST", JSON.stringify({"text": inputValue}));

            if(result.errors) setErrors(result.errors);

            if(result.post){
                onSuccess(result.post);
                setInputValue("");
                setIsAddEditPost(false);
            }
        }
        if(mode === "reply" && post) {
            const result= await  Client(`/posts/${post.id}/replies`, "POST", JSON.stringify({text: inputValue}));
            if (result.errors) setErrors(result.errors);
            if (result.post){
                onSuccess(result.post)
                setIsAddEditPost(false);
            }
        }
        if (mode === "edit" && post) {
            const result = await Client(`/posts/${post.id}`,
                "PUT", JSON.stringify({text: inputValue}));
            if (result.errors) setErrors(result.errors);
            if (result.post) {
                onSuccess(result.post);
                setIsAddEditPost(false);
            }
        }
    }

    return (
        <div className="add-edit-form">
            <div className="add-edit-form-body">
                <img
                    className="add-edit-avatar"
                    src={currentUser.avatar || defaultAvatar}
                    alt={currentUser.username + " avatar"}
                />
                <div className="add-edit-main">
                    <div className="add-edit-user">
                        <h4>{currentUser.displayName}</h4>
                        <p className="text-s text-grey">@{currentUser.username}</p>
                    </div>
                    <textarea
                        className="add-edit-textarea"
                        placeholder="What's happening?"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
            </div>

            <div className="add-edit-footer">
                {errors.length > 0 && (
                    <ul className="add-edit-errors">
                        {errors.map((e, i) => (
                            <li className="text-s" key={i}>{e}</li>
                        ))}
                    </ul>
                )}
                <button
                    className="button button-md button-outline"
                    onClick={handleAddEditPost}
                >
                    {mode === "edit" ? "Save" : "Post"}
                </button>
            </div>
        </div>
    )
}