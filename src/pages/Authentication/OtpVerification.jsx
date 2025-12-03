import { Alert, Box, Button, CircularProgress, Snackbar, TextField, Typography, Paper, IconButton, CssBaseline } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpAction } from "../../redux/auth/auth.action";
import background from "../../assets/images/signin_background.png";
import { useTheme } from "@emotion/react";
import { Brightness7, Brightness4 } from "@mui/icons-material";

function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      ©️ CopyRight {new Date().getFullYear()} TailVerse | All rights reserved.
    </Typography>
  );
}

export default function OtpVerification({ toggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, otpVerificationMessage } = useSelector((store) => store.auth);
  const theme = useTheme();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRefs = useRef([]);

  const email = location.state?.email;
  const context = location.state?.context || "register";
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    if (!email) {
      navigate("/sign-up");
    }
  }, [email, navigate]);

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(verifyOtpAction(email, otpCode, context));

      if (result.payload) {
        setOpen(true);
        setTimeout(() => {
          if (context === "register") {
            navigate("/sign-in");
          } else if (context === "resetPassword") {
            navigate("/reset-password", { state: { email, verified: true } });
          }
        }, 2000);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleResendOtp = () => {
    console.log("Resend OTP for:", email);
  };

  if (!email) {
    return null;
  }

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

      {isLoading ? (
        <CircularProgress />
      ) : (
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
            Verify Your Email
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 2, textAlign: "center" }}>
            Enter the 6-digit code sent to{" "}
            <Typography component="span" fontWeight="bold" color="primary.main">
              {email}
            </Typography>
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    variant="outlined"
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: "1.5rem" },
                    }}
                    sx={{
                      width: 50,
                      height: 56,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                        backdropFilter: "blur(8px)",
                        "&.Mui-focused": {
                          borderColor: "#9d50bb",
                          boxShadow: "0 0 0 2px rgba(157, 80, 187, 0.2)",
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={otp.join("").length !== 6 || isLoading}
                sx={{
                  mt: 2,
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
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                  Didn't receive the code?{" "}
                  <Button variant="text" onClick={handleResendOtp} sx={{ textTransform: "none", p: 0, minWidth: "auto" }}>
                    Resend
                  </Button>
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Button variant="text" onClick={() => navigate("/sign-up")} sx={{ textTransform: "none" }}>
                  Back to Sign Up
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      )}

      <Copyright sx={{ mt: 8, mb: 4 }} />
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          {otpVerificationMessage || "OTP verified successfully!"}
        </Alert>
      </Snackbar>
    </Box>
  );
}
