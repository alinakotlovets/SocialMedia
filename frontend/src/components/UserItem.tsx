import defaultAvatar from "../assets/defaultAvatar.png";
import type {User} from "../types/User.ts";
import {useState} from "react";
import Client from "../api/client.ts";
import {useCurrentUserContext} from "../context/CurrentUserContext.tsx";
import {useNavigate} from "react-router-dom";
import "./UserItem.css"

type UserItemParams={
    user:User,
    handleUserClick: ()=>void
}
export function UserItem({user, handleUserClick}:UserItemParams){
    const [isFollow, setIsFollow] = useState(user.followers && user.followers.length>0);

    const {currentUser} = useCurrentUserContext();
    const navigate = useNavigate();

    async function handleFollowClick() {
        const response = await Client(`/follow/${user.id}`, "POST");
        if(response.message){
            setIsFollow(!isFollow);
        }
    }

    function userClick(){
        handleUserClick();
        navigate(`/user/${user.id}`);
    }

    return(
        <li className="user-item" onClick={userClick}>
            <div className="user-item-info-box">
                <img onClick={()=>navigate(`/user/${user.id}`)}
                src={user.avatar || defaultAvatar} alt={user.username + " avatar image"}/>
                <div className="user-header-box">
                    <h4 className="user-display-name">{user.displayName}</h4>
                    <p className="text-s text-grey">@{user.username}</p>
                </div>
            </div>
            {(currentUser && currentUser.id !== user.id) && (
                <button
                onClick={(e)=>{
                    e.stopPropagation();
                    handleFollowClick()
                }}
                className={"button button-sm " +
                    (isFollow ? "button-outline" : "button-primary")}>
                {isFollow ? "Followed": "Follow"}
                </button>
            )
            }
        </li>
    )
}