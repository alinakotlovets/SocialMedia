import {PostBox} from "../components/postItems/PostBox.tsx";
import "./HomePage.css"
import {useCurrentUserContext} from "../context/CurrentUserContext.tsx";

export function HomePage(){
    const { currentUser} = useCurrentUserContext()

    return(
        <>
            <PostBox currentUser={currentUser}/>
        </>
    )
}