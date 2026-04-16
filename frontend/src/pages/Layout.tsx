import {Sidebar} from "../components/Sidebar.tsx";
import {useCurrentUser} from "../utils/useCurrentUser.ts";
import {Outlet} from "react-router-dom";
import {PostsProvider} from "../context/PostsContext.tsx";

export function Layout(){
    const currentUser = useCurrentUser();

    return(
        <PostsProvider>
            <div className="content-box">
                <div className="page-box">
                    {currentUser && <Sidebar/>}
                    <Outlet/>
                </div>
            </div>
        </PostsProvider>
    )
}