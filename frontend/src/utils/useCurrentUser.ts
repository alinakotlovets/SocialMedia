import {useEffect, useState} from "react";
import type {User} from "../types/User.ts";
import Client from "../api/client.ts";
export function useCurrentUser(){
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
    return currentUser;
}