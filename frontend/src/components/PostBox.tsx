import type {User} from "../types/User.ts";

type PostBoxProps = {
    currentUser: User | null
}
export function PostBox({currentUser}:PostBoxProps){
    return(
        <div className="post-box">
            <h2>Post box: {currentUser?.username}</h2>
        </div>
    )
}