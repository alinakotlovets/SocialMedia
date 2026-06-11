import {useCurrentUserContext} from "../../context/CurrentUserContext.tsx";
import homeIcon from "../../assets/home.png"
import "./Sidebar.css";
import {Sidebar} from "./Sidebar.tsx";
import {useNavigate} from "react-router-dom";

export function MobileMenu(){
    const {currentUser, isLoading} = useCurrentUserContext();
    const navigate = useNavigate();
    return(
        <>
            {!currentUser && !isLoading &&(
                <div className="mobile-menu">
                    <div className="mobile-menu-btn-box">
                        <button onClick={()=>navigate("/login")}
                            className="button button-20px button-primary">Login</button>
                        <button onClick={()=>navigate("/")}
                                className="sidebar-btn">
                            <img src={homeIcon} alt="home button icon"/>
                        </button>
                        <button onClick={()=>navigate("/register")}
                            className="button button-20px button-outline">Register</button>
                    </div>
                </div>
            )}

            {currentUser && (
                <Sidebar/>
            )}
        </>
    )
}