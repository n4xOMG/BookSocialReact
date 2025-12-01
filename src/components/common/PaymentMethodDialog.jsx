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
  useTheme,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";

const PaymentMethodDialog = ({ open, onClose, onSelectPaymentMethod, creditPackage, error }) => {
  const theme = useTheme();
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
          Choose Payment Method
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 4, p: 2, bgcolor: theme.palette.action.hover, borderRadius: "12px" }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Order Summary
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

        <FormControl component="fieldset" fullWidth>
          <FormLabel
            component="legend"
            sx={{
              fontWeight: 700,
              fontSize: "0.9rem",
              mb: 2,
              color: theme.palette.text.secondary,
            }}
          >
            SELECT PAYMENT METHOD
          </FormLabel>
          <RadioGroup value={selectedMethod} onChange={handleMethodChange}>
            <Box
              onClick={() => setSelectedMethod("stripe")}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "16px",
                border: "2px solid",
                borderColor: selectedMethod === "stripe" ? theme.palette.primary.main : theme.palette.divider,
                bgcolor: selectedMethod === "stripe" ? theme.palette.action.selected : "transparent",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  borderColor: theme.palette.primary.light,
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <FormControlLabel
                value="stripe"
                control={<Radio sx={{ color: theme.palette.primary.main, "&.Mui-checked": { color: theme.palette.primary.main } }} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "8px",
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.primary.main,
                        boxShadow: theme.shadows[1],
                      }}
                    >
                      <CreditCardIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        Credit/Debit Card
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Secure payment via Stripe
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ width: "100%", m: 0 }}
              />
            </Box>
            <Box
              onClick={() => setSelectedMethod("paypal")}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "16px",
                border: "2px solid",
                borderColor: selectedMethod === "paypal" ? theme.palette.secondary.main : theme.palette.divider,
                bgcolor: selectedMethod === "paypal" ? theme.palette.action.selected : "transparent",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  borderColor: theme.palette.secondary.light,
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <FormControlLabel
                value="paypal"
                control={<Radio sx={{ color: theme.palette.secondary.main, "&.Mui-checked": { color: theme.palette.secondary.main } }} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "8px",
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.secondary.main,
                        boxShadow: theme.shadows[1],
                      }}
                    >
                      <PaymentIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        PayPal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay with PayPal account
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
            <Alert severity="error" sx={{ borderRadius: "8px" }}>
              {error}
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
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
        <Button
          onClick={handleProceed}
          variant="contained"
          sx={{
            borderRadius: "8px",
            px: 4,
            py: 1,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 700,
            boxShadow: theme.shadows[4],
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
              boxShadow: theme.shadows[6],
            },
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentMethodDialog;
