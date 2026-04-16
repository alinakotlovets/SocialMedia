import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {User} from "../types/User.ts";
import Client from "../api/client.ts";
import defaultAvatar from "../assets/defaultAvatar.png"
import type {Post} from "../types/Post.ts";
import {PostItem} from "../components/PostItem.tsx";
import {useCurrentUser} from "../utils/useCurrentUser.ts";
import "./UserPage.css";
import {ParentPost} from "./ParentPost.tsx";


function PostList({ posts, currentUser, navigate, isReply}: {
    posts: Post[],
    currentUser: User | null,
    isReply: boolean,
    navigate: (path: string) => void }) {
    if (posts.length === 0) return <div className="no-posts"><h3>No posts</h3></div>;
    return (
        <ul>
            {!isReply && posts.map(post => (
                <PostItem
                    key={post.id}
                    currentUser={currentUser}
                    post={post}
                    onEdit={() => console.log("edit")}
                    onClick={() => navigate(`/post/${post.id}`)}
                    onDelete={() => console.log("delete")}
                />
            ))}

            {isReply && posts.map(post=>(
                <ParentPost parentPost={post.parent}
                            post={post}
                            currentUser={currentUser}
                            onEditParent={()=>console.log("edit parent")}
                            onDeleteParent={()=>console.log("delete parent")}
                            onEdit={()=>console.log("edit reply")}
                            onDelete={()=>console.log("delete reply")}/>
            ))}
        </ul>
    );
}
export function UserPage(){
    const {userId} = useParams();
    const [loading, setLoading] = useState <{user:boolean, posts:boolean, likedPosts:boolean,
    replies:boolean}>
    ({user:false, posts:false, likedPosts: false, replies:false});
    const [errors, setErrors] = useState<string[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const [replies, setReplies] = useState<Post[]>([])
    const [chosenPosts, setChosenPosts] = useState<"posts"|"liked" |"replies">("posts");

    const currentUser = useCurrentUser();
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchAll() {
            setLoading({ user: true, posts: true, likedPosts: true, replies: true });

            const [userRes, postsRes, likedRes, repliesRes] = await Promise.all([
                Client(`/user/${userId}`, "GET"),
                Client(`/posts/user/${userId}`, "GET"),
                Client(`/user/${userId}/liked-posts`, "GET"),
                Client(`/user/${userId}/replies`, "GET"),
            ]);

            if (userRes.user) setUser(userRes.user);
            if (postsRes.posts) setPosts(postsRes.posts);
            if (likedRes.posts) setLikedPosts(likedRes.posts);
            if (repliesRes.posts) setReplies(repliesRes.posts);

            const allErrors = [userRes, postsRes, likedRes, repliesRes]
                .flatMap(r => r.errors || []);
            if (allErrors.length) setErrors(allErrors);

            setLoading({ user: false, posts: false, likedPosts: false, replies: false });
        }
        fetchAll();
    }, [userId]);

    const tabContent = {
        posts:   { data: posts,      isLoading: loading.posts,      isReply:false},
        liked:   { data: likedPosts, isLoading: loading.likedPosts, isReply:false},
        replies: { data: replies,    isLoading: loading.replies,    isReply:true },
    };

    const { data, isLoading, isReply} = tabContent[chosenPosts];


    return(
        <div className="post-box">
                <div>
                    {loading.user && (
                        <div>
                            <h3>Loading...</h3>
                        </div>
                )}
                {errors.length > 0 && (
                    <ul className="add-edit-errors">
                        {errors.map((e, i) => (
                            <li className="text-s" key={i}>{e}</li>
                        ))}
                    </ul>
                )}


                {!loading.posts && user && (
                    <>
                        <div className="user-page-header-box">
                            <div className="header-top-box">
                                <div className="header-top-box-info">
                                    <img src={user.avatar || defaultAvatar} alt={user.displayName + " avatar image"}/>
                                    <div className="header-top-box-text">
                                        <h3>{user.displayName}</h3>
                                        <p className="text-grey">@{user.username}</p>
                                    </div>
                                </div>
                                {(currentUser && currentUser.id === Number(userId))
                                    ? (<button className="button button-primary button-sm">Edit</button>)
                                    : (<button className="button button-primary button-sm">Follow</button>)
                                }
                            </div>
                            {user.description && (<h4 className="text-s">{user.description}</h4>)}
                        </div>

                        <div className="user-page-posts-btn-box">
                            <button
                                className={chosenPosts === "posts" ? "active" : ""}
                                onClick={()=>setChosenPosts("posts")}>Posts</button>
                            <button
                                className={chosenPosts === "liked" ? "active" : ""}
                                onClick={()=>setChosenPosts("liked")}>Likes</button>
                            <button
                                className={chosenPosts === "replies" ? "active" : ""}
                                onClick={()=>setChosenPosts("replies")}>Replies</button>
                        </div>
                    </>
                )}
                </div>

                    {isLoading
                        ? <h3>Loading...</h3>
                        : <PostList posts={data} currentUser={currentUser}
                                    isReply={isReply} navigate={navigate}/>
                    }

        </div>
    )
}