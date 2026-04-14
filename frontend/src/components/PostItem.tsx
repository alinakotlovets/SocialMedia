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
import {Modal} from "./ui/Modal.tsx";
import {UnregisteredBox} from "./UnregisteredBox.tsx";
import {useNavigate} from "react-router-dom";

type PostItemProps = {
    currentUser: User | null,
    post:Post,
    onEdit: (post: Post) => void
    onDelete: (id:number)=>void
}

export function PostItem({currentUser, post, onEdit, onDelete}:PostItemProps){

    const menuRef = useRef<HTMLDivElement>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [isMoreOption, setIsMoreOption] = useState(false);
    const [likeCount, setLikeCount] = useState<number>(post._count.likes);
    const [like, setLike] = useState<boolean>(post.likes ? post.likes.length>0 : false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    async function handleDelete(){
        const response = await Client(`/posts/${post.id}`, "DELETE");
        if(response.errors) setErrors(response.errors);
        onDelete(post.id);
    }

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
          } else {
              setLikeCount(likeCount+1);
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

    return(
       <li className="post-list-item"
           onClick={()=> navigate(`/post/${post.id}`)}>
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
           <img  className="post-item-img" src={post.user.avatar || defaultAvatar}
                alt={post.user.username + " avatar"}/>
           <div className="post-item-content">
               <div className="post-item-top-box">
                   <div className="post-item-header">
                       <h4>{post.user.displayName}</h4>
                       <p className="text-s text-grey">@{post.user.username}</p>
                       <p className="text-s text-grey">{formatDate(post.createdAt) !== formatDate(post.editedAt) ?
                           `edited ${formatDate(post.editedAt)} ago` : formatDate(post.createdAt)}</p>
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
               <h3 className="text-s">{post.text}</h3>
               <div className="post-item-action-box">
                   <button className="like-btn button" onClick={(e)=>{
                       e.stopPropagation()
                       handleLike()}}>
                   <img className={like ? "liked-post-img" : "unlike-post-img"}
                        src={like ? liked : unliked} width={15} />
                   <p className="text-grey text-s">{likeCount}</p>
                   </button>
               </div>
           </div>
       </li>
    )
}