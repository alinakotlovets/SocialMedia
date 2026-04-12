import {PostBox} from "../components/PostBox.tsx";
import {useEffect, useState} from "react";
import Client from "../api/client.ts";
import type {User} from "../types/User.ts";
import {UnregisteredBox} from "../components/UnregisteredBox.tsx";
import "./HomePage.css"
export function HomePage(){
    const [currentUser, setCurrentUser] = useState<User|null>(null);

    useEffect(()=>{
        async function getCurrentUser(){
            try {
                const user = await Client("/user", "GET");
                if(user.user) setCurrentUser(user.user);
            } catch (e) {
                setCurrentUser(null);
            }
        }
        getCurrentUser();
    }, []);

    return(
        <div className="content-box">
            <div className="home-page-box">
                <PostBox currentUser={currentUser}/>

                {!currentUser &&(
                    <UnregisteredBox/>
                )}
            </div>
        </div>
    )
}