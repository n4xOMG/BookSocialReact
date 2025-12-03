import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, Typography, useTheme } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentMethodDialog from "../../components/common/PaymentMethodDialog";
import { getActiveCreditPackages } from "../../redux/creditpackage/creditpackage.action";
import PaymentDialog from "./PaymentDialog";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PackageCard = ({ pkg, onPurchase }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "24px",
        bgcolor: theme.palette.background.paper,
        border: "1px solid",
        borderColor: theme.palette.divider,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.shadows[8],
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 4 }}>
        <Typography
          variant="h5"
          component="div"
          className="font-serif"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: theme.palette.text.primary,
          }}
        >
          {pkg.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            mb: 3,
          }}
        >
          <Typography variant="h3" component="span" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
            ${pkg.price}
          </Typography>
        </Box>
        <Box
          sx={{
            py: 1,
            px: 2,
            borderRadius: "50px",
            bgcolor: theme.palette.action.hover,
            display: "inline-block",
            mb: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: theme.palette.secondary.main,
            }}
          >
            {pkg.creditAmount} Credits
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'left', mt: 2 }}>
           <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
             <CheckCircleIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.success.main }} />
             Instant delivery
           </Typography>
           <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
             <CheckCircleIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.success.main }} />
             Secure payment
           </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          size="large"
          variant="contained"
          onClick={() => onPurchase(pkg)}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: "12px",
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: theme.shadows[4],
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
              boxShadow: theme.shadows[6],
              transform: "translateY(-1px)",
            },
          }}
        >
          Purchase Now
        </Button>
      </CardActions>
    </Card>
  );
};

const CreditPackages = () => {
  const theme = useTheme();
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            className="font-serif"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Buy Credits
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Unlock premium features and exclusive content with our credit packages.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress color="primary" size={48} thickness={4} />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              borderRadius: "12px",
              maxWidth: 600,
              mx: "auto",
              mb: 4,
            }}
          >
            {error}
          </Alert>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {activeCreditPackages?.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <PackageCard pkg={pkg} onPurchase={handlePurchase} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Success Message */}
        {checkoutSuccess && (
          <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
            <Alert
              severity="success"
              onClose={() => setCheckoutSuccess("")}
              sx={{
                borderRadius: "12px",
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
      </Container>
    </Box>
  );
};

export default CreditPackages;
