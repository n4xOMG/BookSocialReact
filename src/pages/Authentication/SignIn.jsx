import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserByJwt, loginUserAction } from "../../redux/auth/auth.action";
import { Alert, IconButton, Paper } from "@mui/material"; // Thêm Paper component
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
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

export default function SignIn({toggleTheme}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((store) => store.auth.error);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const theme = useTheme();

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
      if (result?.payload?.token) {
        const userResult = await dispatch(getCurrentUserByJwt(result.payload.token));
        if (userResult?.payload) {
          // Redirect to the intended page or home
          const redirectTo = location.state?.from || "/";
          navigate(redirectTo);
        } else if (userResult?.error === "UNAUTHORIZED") {
          setLoginError("Session expired. Please try logging in again.");
        }
      } else if (error) {
        setLoginError(error);
      }
    } catch (e) {
      console.error("Error signing in: ", e);
      setLoginError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box
          sx={{
            backgroundImage:
              `url(${background})`,
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
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7 sx={{ color: "text.primary"  }} /> : <Brightness4 sx={{ color: "text.primary"  }} />}
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
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <LockOutlinedIcon sx={{ color: "background.default" }} />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ color: "primary.main", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
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