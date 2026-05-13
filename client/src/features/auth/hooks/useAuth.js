import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";


export const useAuth = () => {

    const context = useContext(AuthContext);
    const {user, setuser, loading, setLoading} = context;

    const handleLogin =  async ({email, password}) => {
        setLoading(true);
        try {
            const data = await login({email, password});
            setuser(data?.user);
        } catch(err) {
        } finally {
        setLoading(false)
        }
    }

    const handleRegister = async ({email, password, username}) => {
        setLoading(true);
        const data = await register({username, email, password});
        setuser(data.user);
        setLoading(false);
    }

    const handleLogout =  async () => {
        setLoading(true);
        await logout();
        setuser(null);
        setLoading(false);
    }

    return {user, loading, handleRegister, handleLogin, handleLogout};
}