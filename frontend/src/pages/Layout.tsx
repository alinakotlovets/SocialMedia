import {PostsProvider} from "../context/PostsContext.tsx";
import {UsersPostsProvider} from "../context/UsersPostsContext.tsx";
import {CurrentUserProvider} from "../context/CurrentUserContext.tsx";
import {LayoutContent} from "../components/LayoutContent.tsx";

export function Layout(){
    return(
        <CurrentUserProvider>
            <PostsProvider>
                <UsersPostsProvider>
                    <LayoutContent />
                </UsersPostsProvider>
            </PostsProvider>
        </CurrentUserProvider>
    )
}