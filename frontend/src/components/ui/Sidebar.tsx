import addIcon from "../../assets/add.png";
import homeIcon from "../../assets/home.png"
import logoutIcon from "../../assets/logout.png"
import themeIcon from "../../assets/theme.png"
import profileIcon from "../../assets/user.png"
import searchIcon from "../../assets/search.png"
import "./Sidebar.css"
import {useCurrentUserContext} from "../../context/CurrentUserContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {usePosts} from "../../context/PostsContext.tsx";
import {AddEditPostForm} from "../AddEditPostForm.tsx";
import {Modal} from "./Modal.tsx";
import {useUserPosts} from "../../context/UsersPostsContext.tsx";

export function Sidebar(){

    const menuRef = useRef<HTMLDivElement>(null);
    const [isAddPost, setIsAddPost] = useState<boolean>(false);
    const [isThemeOption, setIsThemeOption] = useState<boolean>(false);
    const navigate = useNavigate();

    const {currentUser} = useCurrentUserContext()
    const {addPost} = usePosts();
    const {addUsersPosts} = useUserPosts();

    function handleLogOut(){
        localStorage.removeItem("token");
        navigate("/login");
    }

    useEffect(() => {
        if (!isThemeOption) return;
        const handleClickOutside = (e:MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsThemeOption(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isThemeOption]);

    if(!currentUser) return null;

    return(
        <>
            {isAddPost && (
                <Modal onClose={()=>setIsAddPost(false)} closeOnOverlayClick={true}>
                    <AddEditPostForm mode={"add"}
                                     post={null}
                                     currentUser={currentUser}
                                     onSuccess={(post) => {
                                         addPost(post);
                                         addUsersPosts(post);
                                         setIsAddPost(false);
                                     }}
                                     setIsAddEditPost={setIsAddPost}/>
                </Modal>
            )}
            <div className="sidebar-btn-box">
                <button onClick={()=>navigate("/")}
                        className="sidebar-btn button-md">
                    <img src={homeIcon} alt="home button icon"/>
                </button>
                <button onClick={()=>navigate(`/user/${currentUser.id}`)}
                        className="sidebar-btn button-md">
                    <img src={profileIcon} alt="profile button icon"/>
                </button>
                <button onClick={()=>setIsAddPost(true)}
                    className="sidebar-btn button-md">
                    <img src={addIcon} alt="add button icon"/>
                </button>
                <div className="theme-menu-wrapper" ref={menuRef}>
                <button onClick={()=> setIsThemeOption(true)}
                    className="sidebar-btn button-md">
                    <img src={themeIcon} alt="theme button icon"/>
                </button>
                    { isThemeOption &&
                        (<div className="theme-menu">
                            <button
                                onClick={()=>{document.documentElement.setAttribute(
                                    "data-theme", "light")}}>
                                Light
                            </button>
                            <button
                                onClick={()=>{document.documentElement.setAttribute(
                                "data-theme", "dark")}}>
                                Dark</button>
                            <button onClick={()=>{
                                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                                document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
                            }}>
                                Auto
                            </button>
                        </div>)
                    }
                </div>
                <button className="sidebar-btn button-md"
                    onClick={()=>navigate("/search")}>
                    <img src={searchIcon} alt="serch button icon"/>
                </button>
                <button onClick={handleLogOut}
                        className="sidebar-btn button-md">
                    <img src={logoutIcon} alt="logout button icon"/>
                </button>
            </div>
        </>
    )
}