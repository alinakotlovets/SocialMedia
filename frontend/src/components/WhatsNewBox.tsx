import type {User} from "../types/User.ts";
import DefaultAvatar from "../assets/defaultAvatar.png"

type WhatsNewBoxProps ={
    currentUser:User | null,
    text: string,
    onClick: () => void
}
export function WhatsNewBox({text, currentUser, onClick}:WhatsNewBoxProps){
    if (!currentUser) return null;
    return(
        <div className="whats-new-box">
            <div className="whats-new-left-box">
                <img src={currentUser.avatar || DefaultAvatar}
                     alt={currentUser.username + " avatar"}/>
                <p className="text-s text-grey"
                   onClick={onClick}>{text}</p>
            </div>
            <button className="button button-md button-outline"
                    onClick={onClick}>Post</button>
        </div>
    )

}