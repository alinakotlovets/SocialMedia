import { useSearchParams } from "react-router-dom";
import {useEffect, useState} from "react";
import Client from "../api/client.ts";
import type {Post} from "../types/Post.ts";
import {PostItem} from "../components/PostItem.tsx";
import {useCurrentUserContext} from "../context/CurrentUserContext.tsx";
import {Modal} from "../components/ui/Modal.tsx";
import {AddEditPostForm} from "../components/AddEditPostForm.tsx";
import {usePosts} from "../context/PostsContext.tsx";

export function PostsSearchPage() {
    const [errors, setErrors] =useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchParams] = useSearchParams();
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isAddEditPost, setIsAddEditPost] = useState(false);
    const search = searchParams.get("search") ?? "";
    const { activeVideoId, setActiveVideoId } = usePosts();

    const {currentUser} = useCurrentUserContext();

    useEffect(() => {
        setErrors([]);
        setPosts([]);
        setIsLoading(true);
        async function getPosts() {
            const response = await Client(`/posts/search?search=${search}`, "GET");
            if(response.errors) setErrors(response.errors);
            if (response.posts) setPosts(response.posts);
        }

        getPosts();
        setIsLoading(false);
    }, []);

    function handlePostUpdated(updatedPost: Post) {
        setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
        setEditingPost(null);
    }


    return(
        <div className="post-box">

            {isAddEditPost && (
                <Modal onClose={() => { setIsAddEditPost(false); setEditingPost(null); }} closeOnOverlayClick={true}>
                    <AddEditPostForm
                        mode="edit"
                        post={editingPost}
                        currentUser={currentUser}
                        onSuccess={handlePostUpdated}
                        setIsAddEditPost={setIsAddEditPost}
                    />
                </Modal>
            )}

            {errors.length>0 && (
                <ul>
                    {errors.map((error, index)=>(
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}

            {isLoading && <p className="text-s text-grey">Loading...</p>}
            {!isLoading && posts.length === 0 && (
                <p className="text-s text-grey">Posts not found</p>
            )}

            {!isLoading && posts.length>0 &&(
                <ul>
                    {posts.map((post)=>
                        <PostItem currentUser={currentUser}
                                  key={post.id}
                                  post={post}
                                  setActiveVideoId={setActiveVideoId}
                                  activeVideoId={activeVideoId}
                                  onEdit={()=>{
                                      setIsAddEditPost(true);
                                      setEditingPost(post);
                                  }}
                                  onDelete={()=>setPosts(posts.filter((p)=>p.id !== post.id))}/>
                    )}
                </ul>
            )}
        </div>
    )
}