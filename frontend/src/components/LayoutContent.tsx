import {useCurrentUserContext} from "../context/CurrentUserContext.tsx";
import {Sidebar} from "./ui/Sidebar.tsx";
import {UnregisteredBox} from "./ui/UnregisteredBox.tsx";
import {Outlet} from "react-router-dom";
export function LayoutContent() {
    const { currentUser, isLoading } = useCurrentUserContext();

    return (
        <div className="content-box">
            <div className="page-box">
                {currentUser && <Sidebar />}

                <Outlet />

                {!currentUser && !isLoading && (
                    <div className="unregistered-box">
                        <UnregisteredBox />
                    </div>
                )}
            </div>
        </div>
    );
}