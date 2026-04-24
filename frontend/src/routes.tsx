import {LoginPage} from "./pages/LoginPage.tsx";
import {RegisterPage} from "./pages/RegisterPage.tsx";
import {Layout} from "./pages/Layout.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {PostPage} from "./pages/PostPage.tsx";
import {UserPage} from "./pages/UserPage.tsx";
import {SearchPage} from "./pages/SearchPage.tsx";
import {PostsSearchPage} from "./pages/PostsSearchPage.tsx";

const routes = [
    {
        path: "/",
        element: <Layout/>,
        children: [
            { path: "/", element: <HomePage/> },
            { path: "/post/:postId", element: <PostPage/> },
            { path: "/user/:userId", element: <UserPage/> },
            {path: "/search", element: <SearchPage/>},
            {path: "/posts/search", element: <PostsSearchPage/>}
        ]
    },
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/register",
        element: <RegisterPage/>
    }
]

export default routes;