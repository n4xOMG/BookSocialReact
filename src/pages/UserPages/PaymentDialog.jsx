import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutForm from "./CheckoutForm";
import PayPalCheckout from "./PayPalCheckout";
import PaymentEnvironmentCheck from "../../components/common/PaymentEnvironmentCheck";

const PaymentDialog = ({ open, onClose, creditPackage, paymentMethod, stripePromise, onError, onSuccess, jwt }) => {
  const [checkoutError, setCheckoutError] = useState("");

  const handleClose = () => {
    setCheckoutError("");
    onClose();
  };

  const handleCheckoutError = (message) => {
    setCheckoutError(message);
    onError(message);
  };

  const handleCheckoutSuccess = () => {
    setCheckoutError("");
    onSuccess();
  };

  const paypalOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            background: "linear-gradient(135deg, #00c9a7, #56efca)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Complete Payment
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
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

        <PaymentEnvironmentCheck paymentMethod={paymentMethod}>
          {paymentMethod === "stripe" && (
            <Box
              sx={{
                mt: 2,
                p: 3,
                borderRadius: "16px",
                background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"),
                backdropFilter: "blur(8px)",
                border: "1px solid",
                borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"),
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Please enter your card details below:
              </Typography>
              <Elements stripe={stripePromise}>
                <CheckoutForm creditPackage={creditPackage} onError={handleCheckoutError} onSuccess={handleCheckoutSuccess} jwt={jwt} />
              </Elements>
            </Box>
          )}

          {paymentMethod === "paypal" && (
            <Box
              sx={{
                mt: 2,
                p: 3,
                borderRadius: "16px",
                background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"),
                backdropFilter: "blur(8px)",
                border: "1px solid",
                borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"),
              }}
            >
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalCheckout creditPackage={creditPackage} onError={handleCheckoutError} onSuccess={handleCheckoutSuccess} jwt={jwt} />
              </PayPalScriptProvider>
            </Box>
          )}
        </PaymentEnvironmentCheck>

        {checkoutError && (
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
              {checkoutError}
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
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
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
