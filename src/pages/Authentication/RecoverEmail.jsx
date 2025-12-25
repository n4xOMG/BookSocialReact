import { Alert, Box, Button, CircularProgress, Paper, Typography, CssBaseline, IconButton } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { rollbackEmailAction } from "../../redux/auth/auth.action";
import background from "../../assets/images/signin_background.png";
import { useTheme } from "@emotion/react";
import { Brightness7, Brightness4, CheckCircle, Error as ErrorIcon } from "@mui/icons-material";

function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      ©️ CopyRight {new Date().getFullYear()} TailVerse | All rights reserved.
    </Typography>
  );
}

export default function RecoverEmail({ toggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");
  const isDarkMode = useMemo(() => theme.palette.mode === "dark", [theme.palette.mode]);

  useEffect(() => {
    if (!token) {
      setError("Invalid recovery link. No token provided.");
      setIsLoading(false);
      return;
    }

    const performRollback = async () => {
      try {
        const result = await dispatch(rollbackEmailAction(token));
        
        if (result.error) {
          setError(result.error);
          setSuccess(false);
        } else {
          setMessage(result.message || "Email has been successfully restored to your previous address.");
          setSuccess(true);
        }
      } catch (err) {
        setError(err?.message || "Failed to recover email. The link may have expired.");
        setSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    performRollback();
  }, [token, dispatch]);

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
          maxWidth: 450,
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
            mb: 3,
          }}
        >
          Email Recovery
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 4 }}>
            <CircularProgress size={48} sx={{ color: "#9d50bb" }} />
            <Typography variant="body1" color="text.secondary">
              Processing your email recovery...
            </Typography>
          </Box>
        ) : success ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 2 }}>
            <CheckCircle sx={{ fontSize: 64, color: "success.main" }} />
            <Alert severity="success" sx={{ borderRadius: 2, width: "100%" }}>
              {message}
            </Alert>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
              Your email has been restored. Please sign in with your original email address.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/sign-in")}
              sx={{
                mt: 2,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                py: 1.5,
                px: 4,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(157, 80, 187, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #b968c7, #9d50bb)",
                  boxShadow: "0 6px 24px rgba(157, 80, 187, 0.5)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Go to Sign In
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 2 }}>
            <ErrorIcon sx={{ fontSize: 64, color: "error.main" }} />
            <Alert severity="error" sx={{ borderRadius: 2, width: "100%" }}>
              {error}
            </Alert>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
              The recovery link may have expired or is invalid. Please contact support if you need assistance.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Go to Home
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/sign-in")}
                sx={{
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                  color: "#fff",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 4px 16px rgba(157, 80, 187, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #b968c7, #9d50bb)",
                    boxShadow: "0 6px 24px rgba(157, 80, 187, 0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Box>
  );
}
