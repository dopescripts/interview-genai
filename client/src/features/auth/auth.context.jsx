import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setuser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        setLoading(true);

        getMe().then(data => {
            setuser(data.user)
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false);
        })

    }, [])


    return (
        <AuthContext.Provider value={{ user, setuser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )

};