import {LoginPage} from "./pages/LoginPage.tsx";
import {RegisterPage} from "./pages/RegisterPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {PostPage} from "./pages/PostPage.tsx";

const routes = [
    {
        path: "/",
        element: <HomePage/>
    },
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/register",
        element: <RegisterPage/>
    },
    {
        path: "/post/:postId",
        element: <PostPage/>
    }
]

export default routes;