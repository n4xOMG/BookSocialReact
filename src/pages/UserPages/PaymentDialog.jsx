import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert, useTheme } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutForm from "./CheckoutForm";
import PayPalCheckout from "./PayPalCheckout";
import PaymentEnvironmentCheck from "../../components/common/PaymentEnvironmentCheck";

const PaymentDialog = ({ open, onClose, creditPackage, paymentMethod, stripePromise, onError, onSuccess, jwt }) => {
  const theme = useTheme();
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
        elevation: 0,
        sx: {
          borderRadius: "24px",
          bgcolor: theme.palette.background.paper,
          border: "1px solid",
          borderColor: theme.palette.divider,
          boxShadow: theme.shadows[10],
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="h5"
          component="div"
          className="font-serif"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Complete Payment
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 4, p: 2, bgcolor: theme.palette.action.hover, borderRadius: "12px" }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Order Details
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {creditPackage?.creditAmount} Credits
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              ${creditPackage?.price}
            </Typography>
          </Box>
        </Box>

        <PaymentEnvironmentCheck paymentMethod={paymentMethod}>
          {paymentMethod === "stripe" && (
            <Box
              sx={{
                mt: 2,
                p: 3,
                borderRadius: "16px",
                bgcolor: theme.palette.background.default,
                border: "1px solid",
                borderColor: theme.palette.divider,
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
                bgcolor: theme.palette.background.default,
                border: "1px solid",
                borderColor: theme.palette.divider,
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
            <Alert severity="error" sx={{ borderRadius: "8px" }}>
              {checkoutError}
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: "8px",
            px: 3,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: theme.palette.action.hover,
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
