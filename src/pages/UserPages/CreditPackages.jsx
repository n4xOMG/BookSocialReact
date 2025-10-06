import React, { useState, useEffect, useCallback } from "react";
import { Box, Card, CardContent, CardActions, Typography, Button, Grid, Alert, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import PaymentMethodDialog from "../../components/common/PaymentMethodDialog";
import PaymentDialog from "./PaymentDialog";
import { getActiveCreditPackages } from "../../redux/creditpackage/creditpackage.action";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CreditPackages = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { activeCreditPackages, loading, error } = useSelector((state) => state.creditpackage);

  const [methodDialogOpen, setMethodDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");

  // Fetch credit packages on component mount
  const fetchCreditPackages = useCallback(async () => {
    try {
      await dispatch(getActiveCreditPackages());
    } catch (err) {
      console.error("Error fetching credit packages:", err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCreditPackages();
  }, [fetchCreditPackages]);

  // Handle opening the payment method selection dialog
  const handlePurchase = (creditPackage) => {
    setSelectedPackage(creditPackage);
    setMethodDialogOpen(true);
    setCheckoutError("");
    setCheckoutSuccess("");
  };

  // Handle payment method selection
  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    setMethodDialogOpen(false);
    setPaymentDialogOpen(true);
  };

  // Handle closing dialogs
  const handleCloseMethodDialog = () => {
    setMethodDialogOpen(false);
    setSelectedPackage(null);
    setCheckoutError("");
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedPackage(null);
    setSelectedPaymentMethod("");
    setCheckoutError("");
  };

  // Handle successful checkout
  const handleCheckoutSuccess = () => {
    setCheckoutSuccess("Purchase successful! Your credits have been updated.");
    fetchCreditPackages();
    handleClosePaymentDialog();
  };

  // Handle checkout errors
  const handleCheckoutError = (message) => {
    setCheckoutError(message);
  };

  return (
    <Box sx={{ display: "flex", height: "100%", overscrollBehavior: "contain" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" gutterBottom pt={3}>
          Buy Credits
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={4} padding={2}>
            {activeCreditPackages?.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {pkg.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {pkg.creditAmount} Credits
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      Price: ${pkg.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="large" variant="contained" color="primary" onClick={() => handlePurchase(pkg)} fullWidth>
                      Buy
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Success Message */}
        {checkoutSuccess && (
          <Box sx={{ mt: 4 }}>
            <Alert severity="success" onClose={() => setCheckoutSuccess("")}>
              {checkoutSuccess}
            </Alert>
          </Box>
        )}

        {/* Payment Method Selection Dialog */}
        <PaymentMethodDialog
          open={methodDialogOpen}
          onClose={handleCloseMethodDialog}
          onSelectPaymentMethod={handleSelectPaymentMethod}
          creditPackage={selectedPackage}
          error={checkoutError}
        />

        {/* Payment Dialog */}
        <PaymentDialog
          open={paymentDialogOpen}
          onClose={handleClosePaymentDialog}
          creditPackage={selectedPackage}
          paymentMethod={selectedPaymentMethod}
          stripePromise={stripePromise}
          onError={handleCheckoutError}
          onSuccess={handleCheckoutSuccess}
          jwt={jwt}
        />
      </Box>
    </Box>
  );
};

export default CreditPackages;
