import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseHistory } from "../../redux/purchase/purchase.action";

// Helper function to safely format IDs of any type
const formatId = (id) => {
  if (id === null || id === undefined) return "N/A";

  if (typeof id === "string") {
    return id.length > 8 ? `#${id.substring(0, 8)}` : `#${id}`;
  }

  // For number or any other type, convert to string
  const idStr = String(id);
  return idStr.length > 8 ? `#${idStr.substring(0, 8)}` : `#${idStr}`;
};

// Helper function to safely format payment intent IDs
const formatPaymentId = (id) => {
  if (!id) return "N/A";

  const idStr = String(id);
  return idStr.length > 12 ? `${idStr.substring(0, 12)}...` : idStr;
};

const PurchaseHistory = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { loading, purchases, error } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(fetchPurchaseHistory());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={300} height={24} sx={{ mb: 3 }} />
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={120} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={150} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((item) => (
                <TableRow key={item}>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="outlined" color="primary" sx={{ mt: 2, borderRadius: 2 }} onClick={() => dispatch(fetchPurchaseHistory())}>
          Try Again
        </Button>
      </Paper>
    );
  }

  if (!loading && !error && (!purchases || purchases.length === 0)) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 3,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/BLANK.jpg/138px-BLANK.jpg"
          alt="No purchases"
          sx={{
            width: 200,
            height: 200,
            mb: 3,
            opacity: 0.8,
          }}
        />
        <Typography variant="h6" gutterBottom>
          No Purchase History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 3 }}>
          You haven't made any purchases yet. Buy credits to unlock premium content and features.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CreditCardIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            py: 1,
          }}
        >
          Purchase Credits
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ReceiptIcon sx={{ mr: 1, color: "#9d50bb" }} />
          <Typography
            variant="h5"
            fontWeight="medium"
            sx={{
              fontFamily: '"Playfair Display", serif',
              background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Purchase History
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          A record of all your credit purchases and transactions
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: "bold",
                    background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.1)" : "rgba(157, 80, 187, 0.08)",
                    backdropFilter: "blur(8px)",
                  },
                }}
              >
                <TableCell>ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow
                  key={purchase.id}
                  sx={{
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatId(purchase.id)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      ${((purchase.amount || 0) / 100).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={purchase.creditPackage?.name || "N/A"}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        bgcolor: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.primary.contrastText,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {purchase.purchaseDate
                        ? new Date(purchase.purchaseDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={purchase.status || "Completed"} size="small" color="success" variant="outlined" sx={{ borderRadius: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                      {formatPaymentId(purchase.paymentIntentId)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default PurchaseHistory;
