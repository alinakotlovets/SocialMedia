import {useState, useEffect, useRef} from "react";
import Client from "../api/client.ts";
import {UserItem} from "../components/UserItem.tsx";
import type {User} from "../types/User.ts";
import {useNavigate} from "react-router-dom";
import "./SearchPage.css"
import SearchIcon from "../assets/search.png"
import rightArrow from "../assets/right-arrow.png"
import {useInfiniteScrollOnScroll} from "../hooks/useInfiniteScroll.ts";

export function SearchPage(){
    const [inputValue, setInputValue] = useState<string>("");
    const [errors, setErrors] = useState<string[]>([])
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);


    useEffect(() => {
        setLoading(true);
        setUsers([]);
        const trimmed = inputValue.trim();
        if (!trimmed) {
            setLoading(false)
            return;
        }

        const timeout = setTimeout(async () => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            const data = await Client(
                `/user/search?search=${encodeURIComponent(trimmed)}`,
                "GET",
                undefined,
                abortRef.current.signal
            );

            if(data.errors) setErrors(data.errors);
            if (data.users) setUsers(data.users);

            setLoading(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [inputValue]);

    const navigate = useNavigate();

    useInfiniteScrollOnScroll({
        items: users,
        setItems: setUsers,
        link: `/user/search`,
        textRes: "users",
        search: `${encodeURIComponent(inputValue.trim())}`
    });

    return(
        <div className="post-box">
            <div className="search-box">
                <div className="search-box">
                    <div className="search-input-wrapper">
                        <img className="search-icon" src={SearchIcon} alt="search"/>
                        <input
                            className="search-input"
                            value={inputValue}
                            placeholder="Search..."
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && inputValue.trim()) {
                                    navigate(`/posts/search?search=${encodeURIComponent(inputValue)}`);
                                }
                            }}
                            type="text"
                        />
                    </div>
                </div>
            </div>
            {errors.length > 0 && (
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}
            {!loading && (users.length > 0 || inputValue.trim() ) && (
                <ul className="search-user-box">
                    <li onClick={() => navigate(`/posts/search?search=${encodeURIComponent(inputValue)}`)}
                        className="user-item">
                        <div className="text-search-box">
                            <img className="grey-icon" src={SearchIcon} alt="search icon"/>
                            <h4>{inputValue}</h4>
                        </div>
                        <img className="grey-icon" src={rightArrow} alt="arrow icon"/>
                    </li>
                    {users.map(user => (
                        <UserItem
                            key={user.id}
                            user={user}
                            handleUserClick={() => {()=> navigate(`/user/${user.id}`)}}
                        />
                    ))}
                </ul>
            )}
            {loading && <p className="text-s text-grey">Loading...</p>}
            {!loading && inputValue.trim() && users.length === 0 && (
                <p className="text-s text-grey">Users not found</p>
            )}
        </div>
    );
}