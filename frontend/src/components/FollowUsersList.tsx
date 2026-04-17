import type {User} from "../types/User.ts"
import {UserItem} from "./UserItem.tsx";
import {useState} from "react";
import "./FollowUsersList.css"

type FollowUsersListProps ={
    followers: User[]
    following: User[]
    followersOrFollowing: "followers" | "following" | null
    setIsFollowForm: (value: boolean) => void
    onTabChange: (type: "followers" | "following") => void
}

export function FollowUsersList({followers, following, followersOrFollowing, setIsFollowForm,
                                    onTabChange}:FollowUsersListProps){


    const [activeTab, setActiveTab] = useState<"followers" | "following" | null>(followersOrFollowing);

    function handleTabChange(type: "followers" | "following" ) {
        setActiveTab(type);
        onTabChange(type);
    }

    const list = activeTab === "followers" ? followers : following;

    return (
        <div className="follow-list-box">
            <div className="follow-list-btn-box">
                <button
                    className={activeTab === "followers" ? "active" : ""}
                    onClick={() => handleTabChange("followers")}>Followers</button>
                <button
                    className={activeTab === "following" ? "active" : ""}
                    onClick={() => handleTabChange("following")}>Following</button>
            </div>
            {list.length === 0
                ? <div className="no-posts"><h3>No {activeTab}</h3></div>
                : <ul className="users-list">
                    {list.map((user: User) =>
                        <UserItem key={user.id} user={user} handleUserClick={() => setIsFollowForm(false)} />
                    )}
                </ul>
            }
        </div>
    )
}