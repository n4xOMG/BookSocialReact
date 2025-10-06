import { Alert, Box } from "@mui/material";

const PaymentEnvironmentCheck = ({ paymentMethod, children }) => {
  const stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

  if (paymentMethod === "stripe" && !stripeKey) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">Stripe payment is not configured. Please contact support.</Alert>
      </Box>
    );
  }

  if (paymentMethod === "paypal" && !paypalClientId) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">PayPal payment is not configured. Please contact support.</Alert>
      </Box>
    );
  }

  return children;
};

export default PaymentEnvironmentCheck;
