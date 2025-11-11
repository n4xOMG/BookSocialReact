import { Brightness7, Brightness4, Check, Error, Visibility, VisibilityOff } from "@mui/icons-material";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {
  Alert,
  CircularProgress,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUserAction } from "../../redux/auth/auth.action";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
import { useTheme } from "@emotion/react";
import LoadingSpinner from "../../components/LoadingSpinner";
import background from "../../assets/images/signin_background.png";

function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      ©️ CopyRight {new Date().getFullYear()} TailVerse | All rights reserved.
    </Typography>
  );
}

export default function SignUp({ toggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((store) => store.auth.error);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fallbackError, setFallbackError] = useState("");
  const [registerData, setRegisterData] = useState({
    fullname: "",
    gender: "",
    birthdate: "",
    username: "",
    email: "",
    password: "",
    avatarUrl: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setError] = useState("");
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [avatar, setAvatar] = useState({
    file: "",
    url: "",
    error: "",
  });
  const theme = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      setIsLoading(false);
    }
  };

  const updatePassword = (newPassword) => {
    setRegisterData((prev) => ({
      ...prev,
      password: newPassword,
    }));
    setStrength(calculatePasswordStrength(newPassword));
    checkRequirements(newPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setAvatar({ error: "", file: file, url: URL.createObjectURL(file) });
    } else {
      setAvatar({ ...avatar, error: "Image size should not exceed 2 MB." });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (registerData.password !== confirmPassword) {
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
        let avatarUrl = "";
        if (avatar.file) {
          avatarUrl = await UploadToCloudinary(avatar.file, "user_avatar");
        }
        const formData = {
          ...registerData,
          avatarUrl,
        };
        const result = await dispatch(registerUserAction({ data: formData }));

        if (result?.error) {
          setFallbackError(result.error);
          setOpen(true);
          return;
        }

        if (result?.payload?.token) {
          // Redirect to OTP verification page
          navigate("/verify-otp", {
            state: {
              email: registerData.email,
              context: "register",
            },
          });
        }
      } catch (e) {
        console.error("Error signing up", e);
        setFallbackError("Unable to complete sign up. Please try again.");
        setOpen(true);
      } finally {
        setIsLoading(false);
        setError("");
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setFallbackError("");
  };

  useEffect(() => {
    localStorage.removeItem("jwt");
    setPasswordsMatch(registerData.password === confirmPassword);
  }, [registerData.password, confirmPassword]);

  useEffect(() => {
    if (authError) {
      setFallbackError("");
      setOpen(true);
    }
  }, [authError]);

  const isDarkMode = theme.palette.mode === "dark";
  const submissionError = authError || fallbackError;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
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

          <Container component="main" maxWidth="xs">
            <Paper
              elevation={10}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Typography component="h1" variant="h5" sx={{ color: "primary.main", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                Create an account
              </Typography>
              <Typography component="h2" variant="subTitle1" sx={{ color: "primary.main", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                Sign up to get started
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    name="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    required
                    value={registerData.username}
                    onChange={handleInputChange}
                  />

                  <TextField
                    name="email"
                    label="Email address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={registerData.email}
                    onChange={handleInputChange}
                  />

                  <TextField
                    name="fullname"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={registerData.fullname}
                    onChange={handleInputChange}
                  />

                  <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    required
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                    value={registerData.birthdate}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, birthdate: e.target.value }))}
                  />
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      alignItems="center"
                      justifyContent="center"
                      aria-label="gender"
                      name="gender"
                      value={registerData.gender}
                      onChange={handleInputChange}
                    >
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      <FormControlLabel value="Other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>

                  <Box>
                    <input accept="image/*" type="file" id="avatar" onChange={handleAvatarChange} style={{ display: "none" }} />
                    <label htmlFor="avatar">
                      <Button variant="outlined" component="span" fullWidth>
                        Upload Avatar
                      </Button>
                    </label>
                    {avatar.file && <img src={avatar.url} alt="Avatar Preview" style={{ width: "100%", height: "auto", marginTop: 8 }} />}
                    {avatar.error && (
                      <Typography variant="body2" color="error">
                        {avatar.error}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      id="password"
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      required
                      value={registerData.password}
                      onChange={(e) => updatePassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
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
                    variant="outlined"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {confirmPassword && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {passwordsMatch ? <Check color="success" /> : <Error color="error" />}
                      <Typography variant="body2" color={passwordsMatch ? "success.main" : "error.main"}>
                        {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ textAlign: "left" }}>
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
                  {passwordError && (
                    <Box sx={{ mt: 2, color: "error.main" }}>
                      <Typography variant="body2">{passwordError}</Typography>
                    </Box>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!Object.values(requirements).every(Boolean) || !passwordsMatch || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 2 }} />
                        Sign up
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                  {submissionError && <Alert severity="error">{submissionError}</Alert>}
                </Box>
              </form>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <a href="/sign-in" style={{ color: "#1976d2", textDecoration: "none" }}>
                  Sign in
                </a>
              </Typography>
            </Paper>
          </Container>
          <Copyright sx={{ mt: 8, mb: 4 }} />

          <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            {submissionError ? (
              <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
                {submissionError}
              </Alert>
            ) : (
              <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
                Please check your mailbox to complete signing up!
              </Alert>
            )}
          </Snackbar>
        </Box>
      )}
    </>
  );
}
