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
    <Box sx={{ display: "flex", minHeight: "100vh", overscrollBehavior: "contain" }}>
      <Box sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            pt: 3,
            pb: 2,
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "2.5rem" },
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textAlign: "center",
            mb: 4,
          }}
        >
          Buy Credits
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress sx={{ color: "#9d50bb" }} size={48} thickness={4} />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              borderRadius: "16px",
              background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 107, 107, 0.15)" : "rgba(255, 107, 107, 0.1)"),
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 107, 107, 0.3)",
              boxShadow: "0 4px 16px rgba(255, 107, 107, 0.2)",
            }}
          >
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3} padding={2}>
            {activeCreditPackages?.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    background: (theme) => (theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.45)" : "rgba(255, 255, 255, 0.22)"),
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid",
                    borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.35)"),
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 16px 48px rgba(157, 80, 187, 0.25)",
                      borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.4)" : "rgba(157, 80, 187, 0.3)"),
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        mb: 2,
                        background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {pkg.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.3rem",
                        mb: 2,
                      }}
                    >
                      {pkg.creditAmount} Credits
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #00c9a7, #56efca)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        mt: 2,
                      }}
                    >
                      ${pkg.price}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      size="large"
                      variant="contained"
                      onClick={() => handlePurchase(pkg)}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #00c9a7, #56efca)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1rem",
                        textTransform: "none",
                        boxShadow: "0 4px 20px rgba(0, 201, 167, 0.3)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #56efca, #84fab0)",
                          boxShadow: "0 6px 28px rgba(0, 201, 167, 0.5)",
                          transform: "translateY(-2px) scale(1.02)",
                        },
                      }}
                    >
                      Purchase Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Success Message */}
        {checkoutSuccess && (
          <Box sx={{ mt: 4, px: 2 }}>
            <Alert
              severity="success"
              onClose={() => setCheckoutSuccess("")}
              sx={{
                borderRadius: "16px",
                background: (theme) => (theme.palette.mode === "dark" ? "rgba(0, 201, 167, 0.15)" : "rgba(0, 201, 167, 0.1)"),
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(0, 201, 167, 0.3)",
                boxShadow: "0 4px 16px rgba(0, 201, 167, 0.2)",
                fontWeight: 600,
              }}
            >
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
