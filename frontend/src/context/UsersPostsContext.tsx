import {createContext, useContext, useState} from "react";
import type {Post} from "../types/Post.ts";

type UsersPostsContextType = {
    posts: Post[],
    setPosts: (posts: Post[]) => void,
    addUsersPosts: (post: Post) => void,
}

const UsersPostsContext = createContext<UsersPostsContextType | null>(null);

export function UsersPostsProvider({children}: {children: React.ReactNode}){
    const [posts, setPosts] = useState<Post[]>([]);

    function addUsersPosts(post: Post){
        setPosts(prev => [post, ...prev]);
    }

    return(
        <UsersPostsContext.Provider value={{posts, setPosts, addUsersPosts}}>
            {children}
        </UsersPostsContext.Provider>
    )
}

export function useUserPosts(){
    const ctx = useContext(UsersPostsContext);
    if(!ctx) throw new Error("usePosts must be used within PostsProvider");
    return ctx;
}