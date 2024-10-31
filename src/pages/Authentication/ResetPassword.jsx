import { Check, Visibility, VisibilityOff } from "@mui/icons-material";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordAction } from "../../redux/auth/auth.action";
const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
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

    // Clear error if all requirements are met
    if (Object.values(newRequirements).every((req) => req)) {
      setError("");
      setIsLoading(false);
    }
  };

  const updatePassword = (newPassword) => {
    setPassword(newPassword);
    setStrength(calculatePasswordStrength(newPassword));
    checkRequirements(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Code: ", code);
    setIsLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else if (
      !requirements.length ||
      !requirements.uppercase ||
      !requirements.lowercase ||
      !requirements.number ||
      !requirements.special
    ) {
      setError("Password does not meet all requirements");
    } else if (strength < 3) {
      setError("Password is not strong enough");
    } else {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await dispatch(resetPasswordAction(code, password));
      } catch (error) {
        console.error("Error resetting password", error);
        alert("Error resetting password");
      } finally {
        setOpen(true);
        setIsLoading(false);
        setError("");
        navigate("/sign-in");
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Card sx={{ width: "100%", maxWidth: 400, mx: "auto", p: 2 }}>
      <CardHeader title="Reset Password" subheader="Choose a new, strong password for your account" />
      <CardContent>
        <form onSubmit={handleSubmit}>
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
            {error && (
              <Box sx={{ mt: 2, color: "error.main" }}>
                <Typography variant="body2">{error}</Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                mt: 3,
                backgroundColor: "black",
                color: "white",
                borderRadius: 2,
                alignSelf: "flex-start",
                "&:hover": {
                  backgroundColor: "#fdf6e3",
                  color: "black",
                },
              }}
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  Reset Password
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </Box>
        </form>
      </CardContent>
      <Box sx={{ p: 2 }}>
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
            {requirements.uppercase && requirements.lowercase ? <Check color="success" /> : <DangerousIcon color="error" />}
            <Typography variant="body2" sx={{ ml: 1 }}>
              Contains uppercase and lowercase letters
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {requirements.number && requirements.special ? <Check color="success" /> : <DangerousIcon color="error" />}
            <Typography variant="body2" sx={{ ml: 1 }}>
              Includes numbers and special characters
            </Typography>
          </Box>
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Reset password succeed!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ResetPassword;
