import {Link} from "react-router-dom";
import "./UnregisteredBox.css";

export function UnregisteredBox(){
    return(
        <>
            <h2>Log in or sign up</h2>
            <p className="text-s">See what people are talking about and join the conversation.</p>
            <div className="unregistered-btn-box">
                <Link className="button button-sm button-primary" to="/login">Login</Link>
                <Link className="button button-sm button-outline" to="/register">Register</Link>
            </div>
        </>
    )
}