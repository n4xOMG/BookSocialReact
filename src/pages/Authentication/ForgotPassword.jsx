import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendForgotPasswordMail } from "../../redux/auth/auth.action";
import { Alert, Box, Button, Card, CardContent, CardHeader, CircularProgress, Snackbar, TextField } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await dispatch(sendForgotPasswordMail(email));
    } catch (error) {
      console.error("Error sending reset password link", error);
      alert("Error sending reset password link");
    } finally {
      setOpen(true);
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
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "grey.100" }}>
      <Card sx={{ width: 350 }}>
        <CardHeader title="Forgot Password" subheader="Enter your email to reset your password." />
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField
                id="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </Box>
          </CardContent>
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
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
              fullWidth
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
          </Box>
        </form>
      </Card>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Reset password link has been sent to your mail!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
