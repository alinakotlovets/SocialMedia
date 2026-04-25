import type {Post} from "../types/Post.ts";
import type {User} from "../types/User.ts";
import {useState, useRef} from "react";
import defaultAvatar from "../assets/defaultAvatar.png";
import Client from "../api/client.ts";
import "./AddEditPostForm.css"
import * as React from "react";
import type {media} from "../types/Media.ts";

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [newMedia, setNewMedia] = useState<{ file: File, previewUrl: string }[]>([]);
    const [inputValue, setInputValue] = useState((mode === "edit" && post?.text) ? post?.text : "");
    const [errors, setErrors] = useState<string[]>([]);
    const [existingMedia, setExistingMedia] = useState<media[]>(
        mode === "edit" ? (post?.media ?? []) : []
    );
    const totalMedia = existingMedia.length + newMedia.length;
    const isSubmittingRef = useRef(false);
    async function handleAddEditPost(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if(isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setErrors([]);
        setIsLoading(true);
        if (mode === "add"){
            const formData =new FormData();
            newMedia.forEach(item => formData.append("media", item.file));
            formData.append("text", inputValue);
            const result = await Client("/posts",
                "POST", formData);

            if(result.errors) setErrors(result.errors);

            if(result.post){
                onSuccess(result.post);
                setInputValue("");
                setIsAddEditPost(false);
            }
        }
        if(mode === "reply" && post) {
            const formData =new FormData();
            newMedia.forEach(item => formData.append("media", item.file));
            formData.append("text", inputValue);
            const result= await  Client(`/posts/${post.id}/replies`, "POST", formData);
            if (result.errors) setErrors(result.errors);
            if (result.post){
                onSuccess(result.post)
                setIsAddEditPost(false);
            }
        }
        if (mode === "edit" && post) {
            const formData =new FormData();
            formData.append("keepMediaIds", JSON.stringify(existingMedia.map(m => m.id)));
            newMedia.forEach(item => formData.append("media", item.file));
            formData.append("text", inputValue);
            const result = await Client(`/posts/${post.id}`,
                "PUT", formData);
            if (result.errors) setErrors(result.errors);
            if (result.post) {
                onSuccess(result.post);
                setIsAddEditPost(false);
            }
        }
        isSubmittingRef.current = false;
        setIsLoading(false);
    }

    return (
        <form className="add-edit-form" encType="multipart/form-data"  onSubmit={handleAddEditPost}>
            {isLoading &&(
                <div className="loading-post">
                    <h4>Loading...</h4>
                </div>
            )}
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
                    <ul className="media-preview">
                        {existingMedia.map((m) => (
                            <li key={m.id} className="media-preview-item">
                                {m.type === "VIDEO"
                                    ? <video src={m.url}/>
                                    : <img src={m.url} alt="media"/>}
                                <button className="remove-image-btn" type="button" onClick={() =>
                                    setExistingMedia(prev => prev.filter(x => x.id !== m.id))
                                }>✕</button>
                            </li>
                        ))}

                        {newMedia.map((item, i) => (
                            <li key={i} className="media-preview-item">
                                {item.file.type.startsWith("video/")
                                    ? <video src={item.previewUrl}/>
                                    : <img src={item.previewUrl} alt={item.file.name}/>}
                                <button type="button" className="remove-image-btn"
                                        onClick={() => {
                                            setNewMedia(prev => {
                                                URL.revokeObjectURL(prev[i].previewUrl);
                                                return prev.filter((_, j) => j !== i);
                                            });
                                        }}>✕</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="add-edit-footer">
                <label htmlFor="fileInput" className={totalMedia >= 2 ? "disabled text-s" : "text-s"}>
                    + Add media
                </label>
                <input
                    id="fileInput"
                    className="file-input-hidden"
                    name="media"
                    type="file"
                    disabled={totalMedia >= 2}
                    accept="image/*,video/*"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            const previewUrl = URL.createObjectURL(file);
                            setNewMedia(prev => [...prev, { file, previewUrl }]);
                        }
                    }}
                />
                <button
                    className="button button-md button-outline"
                    type="submit"
                >
                    {mode === "edit" ? "Save" : "Post"}
                </button>
            </div>

            {errors.length > 0 && (
                <ul className="add-edit-errors">
                    {errors.map((e, i) => (
                        <li className="text-s" key={i}>{e}</li>
                    ))}
                </ul>
            )}
        </form>
    )
}