import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserByJwt } from "../redux/auth/auth.action";
import { isTokenExpired } from "../utils/useAuthCheck";
import { logError } from "../utils/errorLogger";

/**
 * Custom hook for auth initialization
 * Safely fetches user data on app mount without infinite loop risk
 *
 * FIXED: Previous implementation had infinite loop risk where
 * user state change would trigger re-fetch
 */
export const useAuthInitialization = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const hasInitializedRef = useRef(false);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    // Only run once on mount
    if (hasInitializedRef.current) {
      return;
    }

    const initializeAuth = async () => {
      // Skip if already loading or no token
      if (loading || authLoading || !jwt) {
        hasInitializedRef.current = true;
        return;
      }

      // Skip if token expired
      if (isTokenExpired(jwt)) {
        hasInitializedRef.current = true;
        return;
      }

      // Skip if user already loaded
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
  }, []); // Empty deps - only run once on mount

  return { loading: loading || authLoading };
};
