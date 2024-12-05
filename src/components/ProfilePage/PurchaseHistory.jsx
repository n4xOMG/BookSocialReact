import React, { useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchPurchaseHistory } from "../../redux/purchase/purchase.action";

const PurchaseHistory = () => {
  const dispatch = useDispatch();
  const { loading, purchases, error } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(fetchPurchaseHistory());
  }, [dispatch]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Purchase History
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && purchases.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>
          You have no purchase history.
        </Alert>
      )}

      {!loading && !error && purchases.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Purchase ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Credit Package</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Payment Intent ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.id}</TableCell>
                  <TableCell>${purchase.amount.toFixed(2) / 100}</TableCell>
                  <TableCell>{purchase.creditPackage.name || "N/A"}</TableCell>
                  <TableCell>{format(new Date(purchase.purchaseDate), "PPP p")}</TableCell>
                  <TableCell>{purchase.paymentIntentId || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PurchaseHistory;
