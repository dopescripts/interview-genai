import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";


export const useAuth = () => {

    const context = useContext(AuthContext);
    const { user, setuser, loading, setLoading } = context;
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setuser(data?.user);
            setErrorMessage('');
            setSuccess(true);
            return true;
        } catch (err) {
            setErrorMessage(err?.response?.data?.message);
            setSuccess(false);
            return false;
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ email, password, username }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setuser(data.user);
            setErrorMessage('');
            setSuccess(true);
            return true;
        } catch (err) {
            // console.log(err.response?.data?.message);
            setErrorMessage(err?.response?.data?.message);
            setSuccess(false);
            return false;
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setuser(null);
        setLoading(false);
    }

    return { user, loading, handleRegister, handleLogin, handleLogout, errorMessage, success };
}