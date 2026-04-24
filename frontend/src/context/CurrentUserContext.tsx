import { createContext } from "react";
import { useEffect, useState, useContext} from "react";
import type { User } from "../types/User";
import Client from "../api/client";

type CurrentUserContextType = {
    currentUser: User | null;
    isLoading: boolean;
};

const CurrentUserContext = createContext<CurrentUserContextType>({
    currentUser: null,
    isLoading: true,
});


export function useCurrentUserContext() {
    const context = useContext(CurrentUserContext);

    if (!context) {
        throw new Error("useCurrentUserContext must be used inside CurrentUserProvider");
    }

    return context;
}

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        async function getCurrentUser(){
            try {
                const user = await Client("/user", "GET");
                if(user.user) setCurrentUser(user.user);
            } catch (e) {
                setCurrentUser(null);
            } finally {
                setIsLoading(false);
            }
        }
        getCurrentUser();
    }, []);


    return (
        <CurrentUserContext.Provider value={{ currentUser, isLoading }}>
            {children}
        </CurrentUserContext.Provider>
    );
}