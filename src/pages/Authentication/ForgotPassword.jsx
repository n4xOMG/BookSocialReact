import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordMail, verifyOtpAction, resetPasswordAction } from "../../redux/auth/auth.action";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
  Paper,
  IconButton,
  CssBaseline,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Brightness7, Brightness4, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import background from "../../assets/images/signin_background.png";

function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      ©️ CopyRight {new Date().getFullYear()} TailVerse | All rights reserved.
    </Typography>
  );
}

const steps = ["Enter Email", "Verify OTP", "Reset Password"];

const ForgotPassword = ({ toggleTheme }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((store) => store.auth);
  const theme = useTheme();
  const isDarkMode = useMemo(() => theme.palette.mode === "dark", [theme.palette.mode]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpen(true);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await dispatch(sendForgotPasswordMail(email));
      
      // Check for error first
      if (result && result.error) {
        showSnackbar(result.error, "error");
        return;
      }
      
      // Check for success - the action returns { payload: { message, success } }
      if (result && result.payload) {
        showSnackbar("OTP has been sent to your email.", "success");
        setActiveStep(1);
        return;
      }
      
      // If result is undefined or doesn't have expected structure
      // but no error was thrown, assume success (email was sent)
      showSnackbar("OTP has been sent to your email.", "success");
      setActiveStep(1);
    } catch (error) {
      console.error("Error sending OTP:", error);
      showSnackbar(error?.message || "Error sending OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await dispatch(verifyOtpAction(email, otp, "RESET_PASSWORD"));
      if (result.payload) {
        // Store the reset token from the response
        if (result.payload.resetToken) {
          setResetToken(result.payload.resetToken);
          showSnackbar("OTP verified successfully.", "success");
          setActiveStep(2);
        } else {
          showSnackbar("Failed to get reset token. Please try again.", "error");
        }
      } else if (result.error) {
        showSnackbar(result.error, "error");
      }
    } catch (error) {
      console.error("Error verifying OTP", error);
      showSnackbar("Error verifying OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showSnackbar("Passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 8) {
      showSnackbar("Password must be at least 8 characters.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(resetPasswordAction(email, newPassword, resetToken));
      if (result.payload) {
        showSnackbar("Password has been reset successfully!", "success");
        // Navigate to login after a short delay
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      } else if (result.error) {
        showSnackbar(result.error, "error");
      }
    } catch (error) {
      console.error("Error resetting password", error);
      showSnackbar("Error resetting password. Please try again.", "error");
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

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const result = await dispatch(sendForgotPasswordMail(email));
      if (result.payload) {
        showSnackbar("OTP has been resent to your email.", "success");
      } else if (result.error) {
        showSnackbar(result.error, "error");
      }
    } catch (error) {
      showSnackbar("Error resending OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
      backdropFilter: "blur(8px)",
    },
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <form onSubmit={handleSendOtp} style={{ width: "100%" }}>
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
                sx={textFieldStyle}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
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
                  <CircularProgress size={24} sx={{ mr: 2, color: "#fff" }} />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        );

      case 1:
        return (
          <form onSubmit={handleVerifyOtp} style={{ width: "100%" }}>
            <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
              <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                Enter the OTP sent to <strong>{email}</strong>
              </Typography>
              <TextField
                id="otp"
                label="OTP Code"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                fullWidth
                inputProps={{ maxLength: 6 }}
                sx={textFieldStyle}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
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
                  <CircularProgress size={24} sx={{ mr: 2, color: "#fff" }} />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="text"
                onClick={handleResendOtp}
                disabled={isLoading}
                sx={{ textTransform: "none", color: "text.secondary" }}
              >
                Didn't receive OTP? Resend
              </Button>
            </Box>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleResetPassword} style={{ width: "100%" }}>
            <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
              <TextField
                id="new-password"
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                fullWidth
                sx={textFieldStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="confirm-password"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
                sx={textFieldStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <Typography variant="caption" color="error">
                  Passwords do not match
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
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
              disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 8}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 2, color: "#fff" }} />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        );

      default:
        return null;
    }
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
            mb: 2,
          }}
        >
          Reset Password
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ width: "100%", mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    fontSize: "0.75rem",
                    color: "text.secondary",
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: "#9d50bb",
                    fontWeight: 600,
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: "#6e48aa",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        {authState.error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {authState.error}
          </Alert>
        )}
      </Paper>
      <Copyright sx={{ mt: 8, mb: 4 }} />
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
