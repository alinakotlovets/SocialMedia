import type {User} from "../types/User.ts";
import type {Post} from "../types/Post.ts";
import defaultAvatar from "../assets/defaultAvatar.png";
import "./PostItem.css";
import Client from "../api/client.ts";
import {useRef, useState, useEffect} from "react";
import {formatDate} from "../utils/formatDate.ts";
import More from "../assets/more.png"
import liked from "../assets/liked.png"
import unliked from  "../assets/unliked.png"
import share from "../assets/share.png";
import repliesImg from "../assets/replies.png"
import {Modal} from "./ui/Modal.tsx";
import {UnregisteredBox} from "./ui/UnregisteredBox.tsx";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {usePosts} from "../context/PostsContext.tsx";

type PostItemProps = {
    currentUser: User | null,
    post:Post,
    onEdit: (post: Post) => void
    onDelete: (id:number)=>void,
    onClick?: () => void,
    hasThread?: boolean,
    sonHasThread?: boolean,
    repliesCount?:number,
    setActiveVideoId: (value: number) => void,
    activeVideoId: number | null
}

export function PostItem({currentUser, post, onEdit, onDelete, onClick,
                             hasThread, repliesCount, setActiveVideoId, activeVideoId,
                             sonHasThread}:PostItemProps){

    const menuRef = useRef<HTMLDivElement>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [isMoreOption, setIsMoreOption] = useState(false);
    const [likeCount, setLikeCount] = useState<number>(post._count.likes);
    const [like, setLike] = useState<boolean>(post.likes ? post.likes.length>0 : false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const shareRef = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    async function handleDelete(){
        const response = await Client(`/posts/${post.id}`, "DELETE");
        if(response.errors) setErrors(response.errors);
        onDelete(post.id);
    }

    const {posts, setPosts} = usePosts();

    async function handleLike(){
        if (isLiking) return;
        setErrors([]);
        if(!currentUser){
            setShowLoginForm(true);
            return;
        }
        setIsLiking(true)
        const response = await Client(`/like/${post.id}`, "POST");
        if(response.errors) setErrors(response.errors);
        if(response.message){
          if(like){
              setLikeCount(likeCount-1);
              setPosts(posts.map(p => p.id === post.id ? { ...p, likes: [],
                  _count: { ...p._count, likes: p._count.likes - 1 } } : p));
          } else {
              setLikeCount(likeCount+1);
              setPosts(posts.map(p => p.id === post.id ? { ...p, likes: [{ id: post.id }],
                      _count: { ...p._count, likes: p._count.likes + 1 } } : p));
          }
          setLike(!like);
        }
        setIsLiking(false);
    }


    useEffect(() => {
        if (!isMoreOption) return;
        const handleClickOutside = (e:MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMoreOption(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMoreOption]);

    const navigate = useNavigate();

    function handleUserClick(e:React.MouseEvent<HTMLElement>){
        e.stopPropagation();
        navigate(`/user/${post.userId}`);
    }

    useEffect(() => {
        if (!showShareMenu) return;
        const handle = (e: MouseEvent) => {
            if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
                setShowShareMenu(false);
            }
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [showShareMenu]);

    async function handleCopyLink() {
        const url = `${window.location.origin}/post/${post.id}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setShowShareMenu(false);
        }, 500);
    }

    const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

    useEffect(() => {
        if (activeVideoId === null) return;

        videoRefs.current.forEach((videoEl, mediaId) => {
            if (mediaId !== activeVideoId) {
                videoEl.pause();
            }
        });
    }, [activeVideoId]);

    return(
       <li key={post.id} className={`post-list-item 
       ${hasThread ? "has-thread" : ""}
       ${sonHasThread ? "son-has-thread" : ""}`}
           onClick={()=> onClick ? onClick() : navigate(`/post/${post.id}`)}>
           {showLoginForm && (
               <Modal onClose={()=>setShowLoginForm(false)} closeOnOverlayClick={true}>
                   <UnregisteredBox/>
               </Modal>
           )}
           {errors.length>0 &&(
               <ul>
                   {errors.map((e, i)=>
                       <li key={i}>{e}</li>
                   )}
               </ul>
           )}
           <div className="post-item-img-wrapper">
           <img  className="post-item-img" src={post.user.avatar || defaultAvatar}
                 alt={post.user.username + " avatar"}
                 onClick={handleUserClick}/>
           </div>
           <div className="post-item-content">
               <div className="post-item-top-box">
                   <div>
                       <div className="post-item-header">
                           <h4 className="break-word" onClick={handleUserClick}>
                               {post.user.displayName}</h4>
                           {!isMobile &&(
                               <p onClick={handleUserClick}
                                  className="text-s text-grey">
                                   @{post.user.username}</p>
                           )}
                           <p className="text-s text-grey">{formatDate(post.createdAt) !== formatDate(post.editedAt) ?
                               `edited ${formatDate(post.editedAt)}` : formatDate(post.createdAt)}</p>
                       </div>
                       {isMobile &&(
                           <p onClick={handleUserClick}
                              className="text-s text-grey">
                               @{post.user.username}</p>
                       )}
                   </div>
                   <div className="more-menu-wrapper" ref={menuRef}>
                       {currentUser && post.userId === currentUser.id &&(
                           <button className="button more-btn" onClick={(e)=>{
                               e.stopPropagation()
                               setIsMoreOption(p => !p)
                           }}>
                               <img className="button-icon" src={More} alt="More option icon button"/>
                           </button>
                       )}
                       {isMoreOption &&(
                           <div className="more-menu">
                               <button onClick={(e)=>{
                                   e.stopPropagation();
                                   setIsMoreOption(false)
                                   handleDelete()
                               }}>Delete</button>
                               <button onClick={(e)=>{
                                   e.stopPropagation();
                                   onEdit(post)
                                   setIsMoreOption(false)}}>Edit</button>
                           </div>
                       )}
                   </div>
               </div>
               <p className="text-s post-text">{post.text}</p>
               {post.media?.length >0 &&(
                   <ul className={`media-list ${post.media.length === 1 ? "one" : "two"}`}>
                       {post.media.map((m)=>
                       <li key={m.id} className="media-item">
                           {m.type === "IMAGE" && (
                               <img onClick={(e)=>e.stopPropagation()}
                                   src={m.url} alt="post image"/>
                           )}
                           {m.type === "VIDEO" && (
                               <video  ref={(el) => {
                                   if (el) {
                                        videoRefs.current.set(m.id, el);
                                        el.onplay = () => setActiveVideoId(m.id);  // коли юзер натискає play
                                    } else {
                                           videoRefs.current.delete(m.id);
                                    }
                                    }}
                                       onClick={(e) => {
                                           setActiveVideoId(m.id);
                                           e.stopPropagation();
                                       }}
                                       src={m.url} controls></video>
                           )}
                       </li>
                       )}
                   </ul>
               )}
               <div className="post-item-action-box">
                   <button className="like-btn button" onClick={(e)=>{
                       e.stopPropagation()
                       handleLike()}}>
                   <img className={like ? "liked-post-img" : "unlike-post-img"}
                        src={like ? liked : unliked} width={15}
                        alt={+ like ? "grey like button icon. Post not liked" : "red like button. Post liked"}/>
                   <p className="text-grey text-s">{likeCount}</p>
                   </button>
                   <button className="like-btn button">
                       <img className="unlike-post-img"
                            src={repliesImg} width={15} alt="relpies button icon"/>
                       <p className="text-grey text-s">{repliesCount}</p>
                   </button>
                   <div className="share-wrapper" ref={shareRef}>
                       <button className="like-btn button" onClick={(e) => {
                           e.stopPropagation();
                           setShowShareMenu(p => !p);
                       }}>
                           <img className="unlike-post-img" src={share} width={15} alt="share"/>
                       </button>

                       {showShareMenu && (
                           <div className="share-menu" onClick={e => e.stopPropagation()}>
                               <button className="button more-btn" onClick={handleCopyLink}>
                                   {copied ? "✓ Copied!" : "Copy link"}
                               </button>
                           </div>
                       )}
                   </div>
               </div>
           </div>
       </li>
    )
}