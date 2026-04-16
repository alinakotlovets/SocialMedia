import {createContext, useContext, useState} from "react";
import type {Post} from "../types/Post.ts";

type PostsContextType = {
    posts: Post[],
    setPosts: (posts: Post[]) => void,
    addPost: (post: Post) => void,
}

const PostsContext = createContext<PostsContextType | null>(null);

export function PostsProvider({children}: {children: React.ReactNode}){
    const [posts, setPosts] = useState<Post[]>([]);

    function addPost(post: Post){
        setPosts(prev => [post, ...prev]);
    }

    return(
        <PostsContext.Provider value={{posts, setPosts, addPost}}>
            {children}
        </PostsContext.Provider>
    )
}

export function usePosts(){
    const ctx = useContext(PostsContext);
    if(!ctx) throw new Error("usePosts must be used within PostsProvider");
    return ctx;
}