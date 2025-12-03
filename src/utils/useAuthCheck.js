import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "../redux/auth/auth.action";

// Helper function to check if the token is expired
export function isTokenExpired(token) {
  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp) {
      const currentTime = Date.now() / 1000;
      // Add a buffer of 30 seconds to account for timing discrepancies
      return decodedToken.exp - 30 < currentTime;
    }
    return false;
  } catch (e) {
    return true;
  }
}

// Check if token should be refreshed (halfway through its lifetime)
export function shouldRefreshToken(token) {
  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.iat) {
      const currentTime = Date.now() / 1000;
      const halfwayPoint = decodedToken.iat + (decodedToken.exp - decodedToken.iat) / 2;
      return currentTime > halfwayPoint;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export const useAuthCheck = () => {
  const [open, setOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkAuth = useCallback(
    (fn) =>
      async (...args) => {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          setOpen(true);
          setRedirectPath(window.location.pathname);
          return;
        }

        if (isTokenExpired(jwt)) {
          // Try refreshing token first if user checked "remember me"
          const rememberMe = localStorage.getItem("rememberMe") === "true";
          if (rememberMe) {
            const newToken = await dispatch(refreshToken());
            if (!newToken) {
              setOpen(true);
              setRedirectPath(window.location.pathname);
              return;
            }
          } else {
            setOpen(true);
            setRedirectPath(window.location.pathname);
            return;
          }
        } else if (shouldRefreshToken(jwt)) {
          // Proactively refresh token if it's halfway through its lifetime
          dispatch(refreshToken());
        }

        try {
          await fn(...args);
        } catch (error) {
          console.error("Error:", error);
          if (error.response && error.response.status === 401) {
            setOpen(true);
            setRedirectPath(window.location.pathname);
          }
        }
      },
    [dispatch]
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    navigate("/sign-in", { state: { from: redirectPath, message: "Please login to continue" } });
    setOpen(false);
  };

  const AuthDialog = () => (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Authentication Required</DialogTitle>
      <DialogContent>You need to be logged in to access this feature.</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogin} color="primary" variant="contained">
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { checkAuth, AuthDialog };
};
