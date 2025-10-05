import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { getActiveCreditPackages } from "../../redux/creditpackage/creditpackage.action";


// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CreditPackages = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { activeCreditPackages, loading, error } = useSelector((state) => state.creditpackage);

  const [open, setOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
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

  // Handle opening the checkout dialog
  const handlePurchase = (creditPackage) => {
    setSelectedPackage(creditPackage);
    setOpen(true);
    setCheckoutError("");
    setCheckoutSuccess("");
  };

  // Handle closing the checkout dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedPackage(null);
    setCheckoutError("");
  };

  // Handle successful checkout
  const handleCheckoutSuccess = () => {
    setCheckoutSuccess("Purchase successful! Your credits have been updated.");
    fetchCreditPackages();
    handleClose();
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

        {/* Checkout Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Purchase Credits</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              You are about to purchase <strong>{selectedPackage?.creditAmount} credits</strong> for ${selectedPackage?.price}. Please enter
              your payment details below.
            </Typography>
            <Elements stripe={stripePromise}>
              <CheckoutForm creditPackage={selectedPackage} onError={handleCheckoutError} onSuccess={handleCheckoutSuccess} jwt={jwt} />
            </Elements>
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
      </Box>
    </Box>
  );
};

export default CreditPackages;
