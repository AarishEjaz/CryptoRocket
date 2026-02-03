import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useTokenExpiryWatcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.isLoggedUser?.token);

  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const timeout = expiry - Date.now();

      if (timeout <= 0) {
        dispatch(logoutUser());
        navigate("/login");
        toast.error("Session expired. Please log in again.");
        return;
      }

      const timer = setTimeout(() => {
        dispatch(logoutUser());
        navigate("/login");
        toast.error("Session expired. Please log in again.");
      }, timeout);

      return () => clearTimeout(timer);
    } catch (err) {
      dispatch(logoutUser());
      navigate("/login");
    }
  }, [token, dispatch, navigate]);
};

export default useTokenExpiryWatcher;
