import {PostBox} from "../components/PostBox.tsx";
import {UnregisteredBox} from "../components/UnregisteredBox.tsx";
import "./HomePage.css"
import {useCurrentUser} from "../utils/useCurrentUser.ts";
export function HomePage(){
    const currentUser = useCurrentUser();

    return(
        <div className="content-box">
            <div className="home-page-box">
                <PostBox currentUser={currentUser}/>

                {!currentUser &&(
                    <div className="unregistered-box">
                        <UnregisteredBox/>
                    </div>
                )}
            </div>
        </div>
    )
}