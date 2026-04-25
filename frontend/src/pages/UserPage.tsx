import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {User} from "../types/User.ts";
import Client from "../api/client.ts";
import defaultAvatar from "../assets/defaultAvatar.png"
import type {Post} from "../types/Post.ts";
import {useCurrentUserContext} from "../context/CurrentUserContext.tsx";
import "./UserPage.css";
import {PostList} from "../components/PostList.tsx";
import {Modal} from "../components/ui/Modal.tsx";
import {FollowUsersList} from "../components/FollowUsersList.tsx";
import {EditUserForm} from "../components/EditUserForm.tsx";
import {AddEditPostForm} from "../components/AddEditPostForm.tsx";
import {useUserPosts} from "../context/UsersPostsContext.tsx";
import {UnregisteredBox} from "../components/ui/UnregisteredBox.tsx";
import {usePosts} from "../context/PostsContext.tsx";

export function UserPage(){
    const {userId} = useParams();
    const [loading, setLoading] = useState <{user:boolean, posts:boolean, likedPosts:boolean,
    replies:boolean}>
    ({user:false, posts:false, likedPosts: false, replies:false});
    const [errors, setErrors] = useState<string[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const [replies, setReplies] = useState<Post[]>([])
    const [chosenPosts, setChosenPosts] = useState<"posts"|"liked" |"replies">("posts");
    const [isFollow, setIsFollow] = useState<boolean>(false);
    const [followersNum, setFollowersNum] = useState<number | null>(null);
    const [isFollowForm, setIsFollowForm] = useState<boolean>(false);
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const [followersOrFollowing, setFollowersOrFollowing] =
        useState<null | "followers" | "following">(null)
    const [loadedFollowers, setLoadedFollowers] = useState(false);
    const [loadedFollowing, setLoadedFollowing] = useState(false);
    const [isEditUser,setIsEditUser] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isAddEditPost, setIsAddEditPost] = useState(false);
    const [isUnregisterBox, setIsUnregisterBox] = useState<boolean>(false);
    const { activeVideoId, setActiveVideoId } = usePosts();

    const {currentUser} = useCurrentUserContext();
    const navigate = useNavigate();

    const {posts, setPosts} = useUserPosts();

    useEffect(() => {
        setIsFollowForm(false);
        setFollowers([]);
        setFollowing([]);
        setFollowersOrFollowing(null);
        setLoadedFollowers(false);
        setLoadedFollowing(false);
        async function fetchAll() {
            setLoading({ user: true, posts: true, likedPosts: true, replies: true });

            const [userRes, postsRes, likedRes, repliesRes] = await Promise.all([
                Client(`/user/${userId}`, "GET"),
                Client(`/posts/user/${userId}`, "GET"),
                Client(`/user/${userId}/liked-posts`, "GET"),
                Client(`/user/${userId}/replies`, "GET"),
            ]);

            if (userRes.user){
                setUser(userRes.user);
                setIsFollow((userRes.user.followers && userRes.user.followers.length>0));
                setFollowersNum(userRes.user._count.followers);
            }
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

    async function handleFollowClick() {
        const response = await Client(`/follow/${userId}`, "POST");
        if(response.message){
            const newFollowing = followersNum !== null
                ? isFollow ? followersNum - 1 : followersNum + 1
                : 0;
            setFollowersNum(newFollowing);
            setIsFollow(!isFollow);
        }
    }
    async function getFollowersOrFollowing(type: "followers" | "following"){
        setFollowersOrFollowing(type);
        if(type === "followers" && loadedFollowers) return;
        if(type ==="following" && loadedFollowing) return;
        setFollowersOrFollowing(type);

        const response = await Client(`/follow/${userId}/${type}`, "GET");
        if(response.followers){
            setFollowers(response.followers);
            setLoadedFollowers(true);
        }

        if(response.following){
            setFollowing(response.following)
            setLoadedFollowing(true);
        }
    }

    function handleEdit(post: Post) {
        setEditingPost(post);
        setIsAddEditPost(true);
    }

    function handleDelete(id: number) {
        setPosts(posts.filter(p => p.id !== id));
        setLikedPosts(likedPosts.filter(p => p.id !== id));

        const idsToDelete = getDescendantIds(replies, id);
        setReplies(replies.filter(p => !idsToDelete.has(p.id)));
    }

    function getDescendantIds(posts: Post[], deletedId: number): Set<number> {
        const ids = new Set<number>();
        ids.add(deletedId);

        let changed = true;
        while (changed) {
            changed = false;
            for (const post of posts) {
                if (post.parentId !== null && ids.has(post.parentId) && !ids.has(post.id)) {
                    ids.add(post.id);
                    changed = true;
                }
            }
        }

        return ids;
    }

    function handlePostUpdated(updatedPost: Post) {
        setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
        setLikedPosts(likedPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
        setReplies(replies.map(p => p.id === updatedPost.id ? updatedPost : p));
        setEditingPost(null);
    }


    return(
        <div className="post-box">
            {isFollowForm &&(
                <Modal onClose={()=>setIsFollowForm(false)} closeOnOverlayClick={true}>
                    <FollowUsersList followers={followers} following={following}
                                     followersOrFollowing={followersOrFollowing}
                                     setIsFollowForm={setIsFollowForm}
                                     onTabChange={(type)=>getFollowersOrFollowing(type)}/>
                </Modal>
            )}

            {isUnregisterBox &&(
                <Modal onClose={()=>setIsUnregisterBox(false)}
                       closeOnOverlayClick={true}>
                    <UnregisteredBox/>
                </Modal>
            )}

            {isEditUser &&(
                <Modal onClose={()=>setIsEditUser(false)} closeOnOverlayClick={false}>
                    <EditUserForm user={user} setIsEditUser={setIsEditUser}
                                  onSuccess={(user:User)=>setUser(user)}/>
                </Modal>
            )}

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
                                    ? (<button onClick={()=>setIsEditUser(true)}
                                        className="button button-primary button-sm">Edit</button>)
                                    : (<button
                                        onClick={handleFollowClick}
                                        className={"button button-sm " +
                                            (isFollow ? "button-outline" : "button-primary")}>
                                        {isFollow ? "Followed": "Follow"}
                                    </button>)
                                }
                            </div>
                            {user.description && (<h4 className="text-s">{user.description}</h4>)}
                            <div className="user-page-followers-box">
                                <p  onClick={()=>{
                                    if(!currentUser){
                                        setIsUnregisterBox(true)
                                    } else {
                                        getFollowersOrFollowing("followers");
                                        setIsFollowForm(true);
                                    }
                                }}
                                    className="text-s text-grey"
                                    style={{cursor:"pointer"}}>{followersNum} followers</p>
                                <p  onClick={()=>{
                                    if(!currentUser){
                                        setIsUnregisterBox(true)
                                    } else {
                                        getFollowersOrFollowing("following");
                                        setIsFollowForm(true);
                                    }
                                }}
                                    className="text-s text-grey"
                                    style={{cursor:"pointer"}}>{user._count.following} following</p>
                            </div>
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
                        : <PostList
                            posts={data}
                            currentUser={currentUser}
                            setActiveVideoId={setActiveVideoId}
                            activeVideoId={activeVideoId}
                            isReply={isReply}
                            navigate={navigate}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    }

        </div>
    )
}