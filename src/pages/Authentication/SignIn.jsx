import { useTheme } from "@emotion/react";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, IconButton, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import background from "../../assets/images/signin_background.png";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getCurrentUserByJwt, loginUserAction } from "../../redux/auth/auth.action";

function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      ©️ CopyRight {new Date().getFullYear()} TailVerse | All rights reserved.
    </Typography>
  );
}

export default function SignIn({ toggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Check for redirect state
  useEffect(() => {
    if (location.state?.message) {
      setLoginError(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const data = new FormData(event.currentTarget);
      const json = {
        email: data.get("email"),
        password: data.get("password"),
      };

      const rememberMe = data.get("remember") === "remember";

      const result = await dispatch(loginUserAction({ data: json, rememberMe }));

      // Handle error case first
      if (result?.error) {
        setLoginError(result.error);
        return;
      }

      // Handle success case
      if (result?.payload?.token) {
        const userResult = await dispatch(getCurrentUserByJwt(result.payload.token));
        if (userResult?.payload) {
          // Redirect to the intended page or home
          const redirectTo = location.state?.from || "/";
          navigate(redirectTo);
        } else if (userResult?.error === "UNAUTHORIZED") {
          setLoginError("Session expired. Please try logging in again.");
        }
      } else {
        setLoginError("Authentication failed. Please try again.");
      }
    } catch (e) {
      console.error("Error signing in: ", e);
      setLoginError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box
          sx={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
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
              elevation={0}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "24px",
                background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.85)" : "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.3)" : "rgba(157, 80, 187, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  mt: 1,
                  boxShadow: "0 8px 24px rgba(157, 80, 187, 0.4)",
                }}
              >
                <LockOutlinedIcon sx={{ color: "#fff", fontSize: 32 }} />
              </Box>
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  fontSize: "2rem",
                  background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(8px)",
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(8px)",
                    },
                  }}
                />
                {loginError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {loginError}
                  </Alert>
                )}
                <FormControlLabel
                  control={<Checkbox value="remember" name="remember" sx={{ color: "text.primary" }} />}
                  label={<Typography sx={{ color: "text.primary" }}>Remember me</Typography>}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
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
                  }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/forgot-password" variant="body2" sx={{ color: "text.primary", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/sign-up" variant="body2" sx={{ color: "text.primary", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Container>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Box>
      )}
    </>
  );
}
