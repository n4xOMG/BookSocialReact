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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          Choose Payment Method
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            You are about to purchase <strong>{creditPackage?.creditAmount} credits</strong> for <strong>${creditPackage?.price}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please select your preferred payment method:
          </Typography>
        </Box>

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup value={selectedMethod} onChange={handleMethodChange}>
            <FormControlLabel
              value="stripe"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CreditCardIcon color="primary" />
                  <Box>
                    <Typography variant="body1">Credit/Debit Card</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Powered by Stripe - Secure card payment
                    </Typography>
                  </Box>
                </Box>
              }
            />
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PaymentIcon color="primary" />
                  <Box>
                    <Typography variant="body1">PayPal</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pay with your PayPal account or card
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleProceed} variant="contained" color="primary">
          Continue to Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentMethodDialog;
