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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          Complete Payment
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          You are about to purchase <strong>{creditPackage?.creditAmount} credits</strong> for <strong>${creditPackage?.price}</strong>
        </Typography>

        <PaymentEnvironmentCheck paymentMethod={paymentMethod}>
          {paymentMethod === "stripe" && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Please enter your card details below:
              </Typography>
              <Elements stripe={stripePromise}>
                <CheckoutForm creditPackage={creditPackage} onError={handleCheckoutError} onSuccess={handleCheckoutSuccess} jwt={jwt} />
              </Elements>
            </Box>
          )}

          {paymentMethod === "paypal" && (
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalCheckout creditPackage={creditPackage} onError={handleCheckoutError} onSuccess={handleCheckoutSuccess} jwt={jwt} />
            </PayPalScriptProvider>
          )}
        </PaymentEnvironmentCheck>

        {checkoutError && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{checkoutError}</Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
