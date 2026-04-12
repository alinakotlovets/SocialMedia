import type {User} from "../types/User.ts";
import type {Post} from "../types/Post.ts";
import defaultAvatar from "../assets/defaultAvatar.png";
import "./PostItem.css";
import Client from "../api/client.ts";
import {useState} from "react";
import {formatDate} from "../utils/formatDate.ts";

type PostItemProps = {
    currentUser: User | null,
    post:Post,
    onEdit: (post: Post) => void
    onDelete: (id:number)=>void
}

export function PostItem({currentUser, post, onEdit, onDelete}:PostItemProps){

    const [errors, setErrors] = useState<string[]>([]);
    async function handleDelete(){
        const response = await Client(`/posts/${post.id}`, "DELETE");
        if(response.errors) setErrors(response.errors);
        onDelete(post.id);
    }



    return(
       <li className="post-list-item">
           {errors.length>0 &&(
               <ul>
                   {errors.map((e, i)=>
                       <li key={i}>{e}</li>
                   )}
               </ul>
           )}
           <img  className="post-item-img" src={post.user.avatar || defaultAvatar}
                alt={post.user.username + " avatar"}/>
           <div>
               <div className="post-item-header">
                   <h4>{post.user.displayName}</h4>
                   <p className="text-s text-grey">@{post.user.username}</p>
                   <p className="text-s text-grey">{formatDate(post.createdAt) !== formatDate(post.editedAt) ?
                       `edited ${formatDate(post.editedAt)} ago` : formatDate(post.createdAt)}</p>
               </div>
               {currentUser && post.userId === currentUser.id &&(
                   <div>
                       <button onClick={handleDelete}>Delete</button>
                       <button onClick={()=>onEdit(post)}>Edit</button>
                   </div>
               )}
               <h3 className="text-s">{post.text}</h3>
           </div>
       </li>
    )
}