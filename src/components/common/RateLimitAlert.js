import React from "react";
import { Alert, Snackbar } from "@mui/material";

const RateLimitAlert = ({ open, handleClose, retryAfter }) => {
  const message = retryAfter
    ? `Rate limit exceeded. Please try again after ${retryAfter} seconds.`
    : "Rate limit exceeded. Please try again later.";

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={handleClose} severity="warning" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default RateLimitAlert;
