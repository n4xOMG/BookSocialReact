import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserByJwt } from "../redux/auth/auth.action";
import { isTokenExpired } from "../utils/useAuthCheck";
import { logError } from "../utils/errorLogger";


export const useAuthInitialization = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const hasInitializedRef = useRef(false);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    const initializeAuth = async () => {
      if (loading || authLoading || !jwt) {
        hasInitializedRef.current = true;
        return;
      }

      if (isTokenExpired(jwt)) {
        hasInitializedRef.current = true;
        return;
      }

      if (user) {
        hasInitializedRef.current = true;
        return;
      }

      try {
        setLoading(true);
        await dispatch(getCurrentUserByJwt(jwt));
      } catch (error) {
        logError(error, {}, "AuthInitialization");
      } finally {
        setLoading(false);
        hasInitializedRef.current = true;
      }
    };

    initializeAuth();
  }, []);

  return { loading };
};
