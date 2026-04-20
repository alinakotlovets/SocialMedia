import {useState} from "react";

export function SearchPage(){
    const [inputValue, setInputValue] =useState<string>("");


    return(
        <div className="post-box">
            <input
                value={inputValue}
                placeholder="Search..."
                onChange={(e)=>setInputValue(e.target.value)}
                type="text"
            />
        </div>
    )
}