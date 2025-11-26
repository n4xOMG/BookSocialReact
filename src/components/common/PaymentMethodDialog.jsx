import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";

const PaymentMethodDialog = ({ open, onClose, onSelectPaymentMethod, creditPackage, error }) => {
  const [selectedMethod, setSelectedMethod] = useState("stripe");

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const handleProceed = () => {
    onSelectPaymentMethod(selectedMethod);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          background: (theme) => (theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"),
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.3)",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle>
        <Typography
          variant="h5"
          component="div"
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
          Choose Payment Method
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            You are about to purchase{" "}
            <strong
              style={{
                background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {creditPackage?.creditAmount} credits
            </strong>{" "}
            for{" "}
            <strong
              style={{
                background: "linear-gradient(135deg, #00c9a7, #56efca)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ${creditPackage?.price}
            </strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please select your preferred payment method:
          </Typography>
        </Box>

        <FormControl component="fieldset" fullWidth>
          <FormLabel
            component="legend"
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              mb: 2,
              color: (theme) => (theme.palette.mode === "dark" ? "#9d50bb" : "#6e48aa"),
            }}
          >
            Payment Method
          </FormLabel>
          <RadioGroup value={selectedMethod} onChange={handleMethodChange}>
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "16px",
                background:
                  selectedMethod === "stripe"
                    ? (theme) => (theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.15)" : "rgba(157, 80, 187, 0.1)")
                    : (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"),
                backdropFilter: "blur(8px)",
                border: "1px solid",
                borderColor:
                  selectedMethod === "stripe"
                    ? "rgba(157, 80, 187, 0.4)"
                    : (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"),
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "rgba(157, 80, 187, 0.3)",
                  background: (theme) => (theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.1)" : "rgba(157, 80, 187, 0.08)"),
                },
              }}
            >
              <FormControlLabel
                value="stripe"
                control={<Radio sx={{ color: "#9d50bb", "&.Mui-checked": { color: "#9d50bb" } }} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CreditCardIcon sx={{ color: "#9d50bb", fontSize: "2rem" }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Credit/Debit Card
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Powered by Stripe - Secure card payment
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ width: "100%", m: 0 }}
              />
            </Box>
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "16px",
                background:
                  selectedMethod === "paypal"
                    ? (theme) => (theme.palette.mode === "dark" ? "rgba(0, 201, 167, 0.15)" : "rgba(0, 201, 167, 0.1)")
                    : (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"),
                backdropFilter: "blur(8px)",
                border: "1px solid",
                borderColor:
                  selectedMethod === "paypal"
                    ? "rgba(0, 201, 167, 0.4)"
                    : (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"),
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "rgba(0, 201, 167, 0.3)",
                  background: (theme) => (theme.palette.mode === "dark" ? "rgba(0, 201, 167, 0.1)" : "rgba(0, 201, 167, 0.08)"),
                },
              }}
            >
              <FormControlLabel
                value="paypal"
                control={<Radio sx={{ color: "#00c9a7", "&.Mui-checked": { color: "#00c9a7" } }} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <PaymentIcon sx={{ color: "#00c9a7", fontSize: "2rem" }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        PayPal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay with your PayPal account or card
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ width: "100%", m: 0 }}
              />
            </Box>
          </RadioGroup>
        </FormControl>

        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert
              severity="error"
              sx={{
                borderRadius: "12px",
                background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 107, 107, 0.15)" : "rgba(255, 107, 107, 0.1)"),
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
              }}
            >
              {error}
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            color: "text.secondary",
            "&:hover": {
              background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleProceed}
          variant="contained"
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            background: "linear-gradient(135deg, #00c9a7, #56efca)",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(0, 201, 167, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #56efca, #84fab0)",
              boxShadow: "0 6px 24px rgba(0, 201, 167, 0.5)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Continue to Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentMethodDialog;
