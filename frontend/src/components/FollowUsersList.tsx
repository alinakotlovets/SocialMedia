import type {User} from "../types/User.ts"
import {UserItem} from "./UserItem.tsx";
import {useState} from "react";
import {useInfiniteScrollOnScroll} from "../hooks/useInfiniteScroll.ts";
import "./FollowUsersList.css"

type FollowUsersListProps ={
    followers: User[]
    following: User[]
    followersOrFollowing: "followers" | "following" | null
    setIsFollowForm: (value: boolean) => void
    onTabChange: (type: "followers" | "following") => void,
    setFollowers: (v: any) => void
    setFollowing: (v: any) => void
    userId: string | number
}

export function FollowUsersList({followers, following, followersOrFollowing, setIsFollowForm,
                                    onTabChange,  setFollowers, setFollowing, userId}:FollowUsersListProps){


    const [activeTab, setActiveTab] = useState<"followers" | "following" | null>(followersOrFollowing);

    function handleTabChange(type: "followers" | "following" ) {
        setActiveTab(type);
        onTabChange(type);
    }

    const list = activeTab === "followers" ? followers : following;
    const setList = activeTab === "followers" ? setFollowers : setFollowing;
    const link = activeTab ? `/follow/${userId}/${activeTab}` : undefined;

    useInfiniteScrollOnScroll({
        items: list,
        setItems: setList,
        link: link,
        textRes: activeTab === "followers" ? "followers" : "following"
    });

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