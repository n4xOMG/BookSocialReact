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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserByJwt, loginUserAction } from "../../redux/auth/auth.action";
import { Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      BookSocial {new Date().getFullYear()}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((store) => store.auth.error);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

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

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                {loginError && <Alert severity="error">{loginError}</Alert>}
                <FormControlLabel control={<Checkbox value="remember" name="remember" color="primary" />} label="Remember me" />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 3,
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: 2,
                    alignSelf: "flex-start",
                    "&:hover": {
                      backgroundColor: "#fdf6e3",
                      color: "black",
                    },
                  }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/forgot-password" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/sign-up" variant="body2">
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}
