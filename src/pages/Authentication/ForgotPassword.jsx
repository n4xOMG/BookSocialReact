import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordMail } from "../../redux/auth/auth.action";
import { Alert, Box, Button, CircularProgress, Snackbar, TextField, Typography, Paper, IconButton, CssBaseline } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Brightness7, Brightness4 } from "@mui/icons-material";
import background from "../../assets/images/signin_background.png"; // Import the background image

function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      ©️ CopyRight {new Date().getFullYear()} TailVerse | All rights reserved.
    </Typography>
  );
}

const ForgotPassword = ({ toggleTheme }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const authState = useSelector((store) => store.auth);
  const theme = useTheme();
  const isDarkMode = useMemo(() => theme.palette.mode === "dark", [theme.palette.mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await dispatch(sendForgotPasswordMail(email));
      if (result.payload) {
        setOpen(true);
      }
    } catch (error) {
      console.error("Error sending reset password link", error);
    } finally {
      setIsLoading(false);
      setEmail("");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <CssBaseline />
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <IconButton onClick={toggleTheme} color="inherit">
          {isDarkMode ? <Brightness7 sx={{ color: "text.primary" }} /> : <Brightness4 sx={{ color: "text.primary" }} />}
        </IconButton>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
          mt: 4,
          borderRadius: "24px",
          background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.85)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.3)" : "rgba(157, 80, 187, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: "1.75rem",
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Forgot Password
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 2, textAlign: "center" }}>
          Enter your email to reset your password.
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
            <TextField
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(8px)",
                },
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              mt: 3,
              mb: 3,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              py: 1.5,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(157, 80, 187, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #b968c7, #9d50bb)",
                boxShadow: "0 6px 24px rgba(157, 80, 187, 0.5)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "rgba(157, 80, 187, 0.3)",
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                Sending Reset Link
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
          {authState.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {authState.error}
            </Alert>
          )}
        </form>
      </Paper>
      <Copyright sx={{ mt: 8, mb: 4 }} />
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        {authState.error ? (
          <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
            {authState.error}
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
            Reset password link has been sent to your mail!
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
