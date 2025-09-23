import { Check, Visibility, VisibilityOff } from "@mui/icons-material";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Typography,
  Paper,
  CssBaseline,
  Link,
  Avatar
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordAction } from "../../redux/auth/auth.action";
import background from "../../assets/images/signin_background.png";
import { useTheme } from "@emotion/react";
import { Brightness7, Brightness4 } from "@mui/icons-material";

// Placeholder for Copyright component
function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      ©️ CopyRight {new Date().getFullYear()} TailVerse | All rights reserved.
    </Typography>
  );
}

const ResetPassword = ({ toggleTheme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length > 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };

  const checkRequirements = (password) => {
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    setRequirements(newRequirements);

    if (Object.values(newRequirements).every((req) => req)) {
      setError("");
      // setIsLoading(false); // Note: keep isLoading for form submission
    }
  };

  const updatePassword = (newPassword) => {
    setPassword(newPassword);
    setStrength(calculatePasswordStrength(newPassword));
    checkRequirements(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    const allRequirementsMet = Object.values(requirements).every((req) => req);
    if (!allRequirementsMet) {
      setError("Password does not meet all requirements");
      setIsLoading(false);
      return;
    }

    if (strength < 3) {
      setError("Password is not strong enough");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await dispatch(resetPasswordAction(code, password));
      setOpen(true);
      setError("");
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password", error);
      setError("Error resetting password");
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
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={toggleTheme} color="inherit">
          {isDarkMode ? <Brightness7 sx={{ color: "text.primary"  }} /> : <Brightness4 sx={{ color: "text.primary"  }} />}
        </IconButton>
      </Box>

      <Paper
        elevation={10}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
          mt: 4,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon sx={{ color: "background.default" }} />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ color: "primary.main", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
          Reset Password
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 2, textAlign: "center" }}>
          Choose a new, strong password for your account
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ position: "relative" }}>
              <TextField
                id="new-password"
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => updatePassword(e.target.value)}
                fullWidth
                required
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
            
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              {[1, 2, 3, 4, 5].map((level) => (
                <Box
                  key={level}
                  sx={{
                    height: 8,
                    width: "100%",
                    borderRadius: 1,
                    bgcolor: strength >= level ? "green" : "grey.300",
                  }}
                />
              ))}
            </Box>

            <TextField
              id="confirm-password"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
            />
          </Box>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Password Requirements:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {requirements.length ? <Check color="success" /> : <DangerousIcon color="error" />}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  At least 8 characters long
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {requirements.uppercase || requirements.lowercase ? <Check color="success" /> : <DangerousIcon color="error" />}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Contains uppercase and lowercase letters
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {requirements.number || requirements.special ? <Check color="success" /> : <DangerousIcon color="error" />}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Includes numbers or special characters
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              mt: 3,
              mb: 3,
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
          
          <Link href="/sign-in" variant="body2" sx={{ color: "text.primary", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
            Back to Sign In
          </Link>
        </form>
      </Paper>
      
      <Copyright sx={{ mt: 8, mb: 4 }} />
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Password reset successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPassword;