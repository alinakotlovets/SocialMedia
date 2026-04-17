import {Sidebar} from "../components/ui/Sidebar.tsx";
import {useCurrentUser} from "../utils/useCurrentUser.ts";
import {Outlet} from "react-router-dom";
import {PostsProvider} from "../context/PostsContext.tsx";
import {UsersPostsProvider} from "../context/UsersPostsContext.tsx";

export function Layout(){
    const currentUser = useCurrentUser();

    return(
        <PostsProvider>
            <UsersPostsProvider>
                <div className="content-box">
                    <div className="page-box">
                        {currentUser && <Sidebar/>}
                        <Outlet/>
                    </div>
                </div>
            </UsersPostsProvider>
        </PostsProvider>
    )
}