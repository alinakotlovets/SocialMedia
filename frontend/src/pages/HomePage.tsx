import {PostBox} from "../components/PostBox.tsx";
import {UnregisteredBox} from "../components/ui/UnregisteredBox.tsx";
import "./HomePage.css"
import {useCurrentUser} from "../utils/useCurrentUser.ts";
export function HomePage(){
    const currentUser = useCurrentUser();

    return(
        <>
            <PostBox currentUser={currentUser}/>

            {!currentUser &&(
                <div className="unregistered-box">
                    <UnregisteredBox/>
                </div>
            )}
        </>

    )
}