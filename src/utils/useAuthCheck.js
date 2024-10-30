import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Helper function to check if the token is expired
export function isTokenExpired(token) {
  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp) {
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    }
    return false;
  } catch (e) {
    return true;
  }
}

export const useAuthCheck = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkAuth = useCallback(
    (fn) =>
      async (...args) => {
        const jwt = localStorage.getItem("jwt");

        if (!jwt || isTokenExpired(jwt)) {
          setOpen(true);
          return;
        }
        try {
          await fn(...args);
        } catch (error) {
          console.error("Error:", error);
        }
      },
    [dispatch]
  );

  const handleClose = () => {
    setOpen(false);
  };

  const AuthDialog = () => (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>You haven't logged in</DialogTitle>
      <DialogContent>Please log in to continue.</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={() => navigate("/sign-in")} color="primary">
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { checkAuth, AuthDialog };
};
