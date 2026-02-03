import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { logoutUser } from "../redux/slices/authSlice";

const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        // Clear localStorage or cookies if needed
        // Redux logout
        dispatch(logoutUser());
        setTimeout(() => {
            localStorage.clear();
            setLoading(false);
            navigate('/login')
        }, 2000)
    };
    return { logout, loading };
};

export default useLogout;
