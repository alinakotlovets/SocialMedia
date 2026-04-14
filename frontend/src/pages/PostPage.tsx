import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Client from "../api/client.ts";
import type {Post} from "../types/Post.ts";
import {Modal} from "../components/ui/Modal.tsx";
import {AddEditPostForm} from "../components/AddEditPostForm.tsx";
import {PostItem} from "../components/PostItem.tsx";
import {useCurrentUser} from "../utils/useCurrentUser.ts";
import "./HomePage.css";
export function PostPage(){
    const { postId } = useParams();

    const [loading, setLoading] = useState<{post:boolean, replies: boolean}>({post:false, replies: false});
    const [errors, setErrors] = useState<string[]>([]);
    const [post, setPost] = useState<Post | null>(null);
    const [isAddEdit, setIsAddEdit] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [replies, setReplies] = useState<Post[]>([])

    const currentUser = useCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {

        setLoading((prev)=>({...prev, post: true}));
        async function getPost(){
            const response =  await Client(`/posts/${postId}`, "GET");
            if(response.errors) setErrors(response.errors);
            if(response.post) {
                setPost(response.post);
            }
        }
        getPost();
        setLoading((prev)=>({...prev, post:false}));
    }, []);

    useEffect(() => {
        setLoading((prev)=>({...prev, replies:true}))
        async function getReplies(){
            if(!post) return;
            const response = await Client(`/posts/${post.id}/replies`, "GET");
            if (response.errors) setErrors(response.errors);
            if(response.replies) setReplies(response.replies);

        }

        getReplies();
        setLoading((prev)=>({...prev, replies:false}))

    }, [post]);

    return(
        <div className="content-box">
            <div className="home-page-box">
                <div className="post-box">
                    {loading.post &&(<h3>Loading...</h3>)}

                    {errors.length > 0 && (
                        <ul className="add-edit-errors">
                            {errors.map((e, i) => (
                                <li className="text-s" key={i}>{e}</li>
                            ))}
                        </ul>
                    )}

                    {isAddEdit && (
                        <Modal onClose={()=>{setIsAddEdit(false); setEditingPost(null)}} closeOnOverlayClick={true}>
                            <AddEditPostForm mode={editingPost ? "edit" : "reply"}
                                             post={post}
                                             currentUser={currentUser}
                                             onSuccess={(updatedPost) => {
                                                 editingPost? setPost(updatedPost) : setReplies([...replies, updatedPost])
                                             }}
                                             setIsAddEditPost={setIsAddEdit}/>
                        </Modal>
                    )}
                    {post && (
                        <PostItem currentUser={currentUser}
                                  post={post}
                                  onEdit={()=>{
                                      setEditingPost(post);
                                      setIsAddEdit(true)
                                  }}
                                  onDelete={()=>navigate("/")}/>
                    )}

                    { post &&  currentUser &&(
                        <div className="whats-new-box">
                            <div className="whats-new-left-box">
                                {currentUser.avatar &&(
                                    <img src={currentUser.avatar}
                                         alt={currentUser.username + " avatar"}/>
                                )}
                                <p className="text-s text-grey"
                                   onClick={()=>{setIsAddEdit(true); setEditingPost(null)}}>Reply...</p>
                            </div>
                            <button className="button button-md button-outline"
                                    onClick={()=> {setIsAddEdit(true); setEditingPost(null)}}>Post</button>
                        </div>
                    )}
                    <div className="replies-box">
                        {loading.replies === false && replies.length === 0 &&(
                            <h4>There no comment yet</h4>
                        )}
                        {loading.replies === false && replies.length>0 && replies.map((r)=>(
                            <PostItem currentUser={currentUser}
                                      post={r}
                                      onEdit={()=>{
                                          setEditingPost(post);
                                          setIsAddEdit(true)
                                      }}
                                      onDelete={()=> setReplies(replies.filter((repl)=> repl.id !== r.id))}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
