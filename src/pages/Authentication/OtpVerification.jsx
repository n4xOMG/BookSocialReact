import { Alert, Box, Button, Card, CardContent, CardHeader, CircularProgress, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpAction } from "../../redux/auth/auth.action";

export default function OtpVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, otpVerificationMessage } = useSelector((store) => store.auth);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRefs = useRef([]);

  // Get email and context from navigation state
  const email = location.state?.email;
  const context = location.state?.context || "register";

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

      // Auto-focus next input
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
    // You might want to implement resend OTP functionality here
    console.log("Resend OTP for:", email);
  };

  if (!email) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        background: "linear-gradient(to bottom, #f0f4f8, #d9e2ec)",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, p: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="Verify Your Email" subheader={`Enter the 6-digit code sent to ${email}`} sx={{ textAlign: "center" }} />
        <CardContent>
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
                    sx={{ width: 50, height: 56 }}
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
                sx={{ mt: 2 }}
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
                <Button variant="text" onClick={() => navigate(-1)} sx={{ textTransform: "none" }}>
                  Back to Sign Up
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          {otpVerificationMessage || "OTP verified successfully!"}
        </Alert>
      </Snackbar>
    </Box>
  );
}
