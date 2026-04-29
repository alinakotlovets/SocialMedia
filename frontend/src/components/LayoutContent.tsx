import {useCurrentUserContext} from "../context/CurrentUserContext.tsx";
import {useState, useEffect} from "react";
import {Sidebar} from "./ui/Sidebar.tsx";
import {UnregisteredBox} from "./ui/UnregisteredBox.tsx";
import {Outlet} from "react-router-dom";
import {MobileMenu} from "./MobileMenu.tsx";
export function LayoutContent() {
    const { currentUser, isLoading } = useCurrentUserContext();
    const [isMobileMenu, setIsMobileMenu] = useState(window.innerWidth <= 1100);


    useEffect(() => {
        const handleResize = () => {
            setIsMobileMenu(window.innerWidth <= 1100);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <div className="content-box">
            <div className="page-box">
                {currentUser && <Sidebar />}

                <Outlet />

                {!isMobileMenu && !currentUser && !isLoading && (
                    <div className="unregistered-box">
                        <UnregisteredBox />
                    </div>
                )}

                {isMobileMenu &&(
                    <MobileMenu/>
                )}
            </div>
        </div>
    );
}