import {useState} from "react";
import * as React from "react";
import Client from "../api/client.ts";
import type {User} from "../types/User.ts";

type EditUserFormProps = {
    user:User | null,
    setIsEditUser: (value:boolean)=>void,
    onSuccess: (value:User)=>void
}
export function EditUserForm({user, setIsEditUser, onSuccess}:EditUserFormProps){
    if(!user) return  null;

    const [inputValue, setInputValue] = useState({
        displayName: user.displayName,
        description: user.description || ""
    })

    const [avatar, setAvatar] = useState<File | null>(null);


    function handleChange(e: React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLTextAreaElement>){
        const {name, value} = e.target;
        setInputValue(prev=>({
            ...prev,
            [name]:value
        }))
    }

    const [errors, setErrors] = useState<string[]>([]);
    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
        setErrors([]);
        e.preventDefault();
        const formData = new FormData();
        formData.append("displayName", inputValue.displayName);

        if(inputValue.description !== ""){
            formData.append("description", inputValue.description);
        }
        if (avatar) {
            formData.append("avatar", avatar);
        }

        const response = await Client(`/user/${user?.id}`, "POST", formData);
        if(response.errors){
            setErrors(response.errors);
        }
        if(response.user) {
            onSuccess(response.user);
        }

        setIsEditUser(false);
    }



    return(
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label className="text-grey text-s" htmlFor="login">Display name:</label>
                <input id="displayName"
                       name="displayName"
                       type="text"
                       value={inputValue.displayName}
                       onChange={handleChange}
                />
                <label className="text-grey text-s">Description:</label>
                <textarea
                    style={{width:"100%", minHeight:"100px"}}
                    id="description"
                    name="description"
                    value={inputValue.description}
                    onChange={handleChange}
                />
                {avatar && (
                    <div className="image-preview">
                        <p className="text-grey text-s">Preview image:</p>
                        <img width={150} height={150} style={{objectFit:"cover"}}
                             src={URL.createObjectURL(avatar)} alt="preview" />
                    </div>
                )}
                <label className="text-grey text-s" htmlFor="avatar">Avatar:</label>
                <input id="avatar"
                       type="file"
                       name="avatar"
                       onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                           if(e.target.files && e.target.files[0]){
                               setAvatar(e.target.files[0]);
                           }
                       }}/>
                <div className="submit-btn-box">
                    <button className="button button-lg button-primary submit-btn" type="submit">Submit</button>
                </div>
                {errors.length>0 && (
                    <ul>
                        {errors.map((error, index)=>(
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
            </form>
    )
}