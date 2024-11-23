import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Search, Refresh, MoneyOff, Edit } from "@mui/icons-material";
import { fetchPaymentTransactions, issueRefund, adjustPayment } from "../../utils/api"; // Adjust the path as needed

const PaymentTracking = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    timePeriod: "",
    paymentStatus: "",
  });
  const [openRefund, setOpenRefund] = useState(false);
  const [openAdjust, setOpenAdjust] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await fetchPaymentTransactions(filters);
    setTransactions(data);
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    loadTransactions();
  };

  const handleRefresh = () => {
    setFilters({ timePeriod: "", paymentStatus: "" });
    loadTransactions();
  };

  const handleOpenRefund = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenRefund(true);
  };

  const handleCloseRefund = () => {
    setSelectedTransaction(null);
    setOpenRefund(false);
  };

  const handleSubmitRefund = async () => {
    await issueRefund(selectedTransaction.id);
    handleCloseRefund();
    loadTransactions();
  };

  const handleOpenAdjust = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenAdjust(true);
  };

  const handleCloseAdjust = () => {
    setSelectedTransaction(null);
    setAdjustAmount("");
    setOpenAdjust(false);
  };

  const handleSubmitAdjust = async () => {
    await adjustPayment(selectedTransaction.id, parseFloat(adjustAmount));
    handleCloseAdjust();
    loadTransactions();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Payment Tracking
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          select
          label="Time Period"
          name="timePeriod"
          value={filters.timePeriod}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </TextField>

        <TextField
          select
          label="Payment Status"
          name="paymentStatus"
          value={filters.paymentStatus}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
        </TextField>

        <Button variant="contained" startIcon={<Search />} onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh}>
          Reset
        </Button>
      </Box>

      {/* Payment Transactions Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Package Purchased</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount ($)</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((txn) => (
            <TableRow key={txn.id}>
              <TableCell>{txn.userId}</TableCell>
              <TableCell>{txn.packageName}</TableCell>
              <TableCell>{txn.paymentStatus}</TableCell>
              <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
              <TableCell>{txn.amount.toFixed(2)}</TableCell>
              <TableCell align="right">
                <Tooltip title="Issue Refund">
                  <IconButton color="error" onClick={() => handleOpenRefund(txn)}>
                    <MoneyOff />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Adjust Payment">
                  <IconButton color="primary" onClick={() => handleOpenAdjust(txn)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Issue Refund Dialog */}
      <Dialog open={openRefund} onClose={handleCloseRefund}>
        <DialogTitle>Issue Refund</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to issue a refund for transaction ID: {selectedTransaction?.id}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRefund}>Cancel</Button>
          <Button onClick={handleSubmitRefund} variant="contained" color="error">
            Refund
          </Button>
        </DialogActions>
      </Dialog>

      {/* Adjust Payment Dialog */}
      <Dialog open={openAdjust} onClose={handleCloseAdjust}>
        <DialogTitle>Adjust Payment</DialogTitle>
        <DialogContent>
          <TextField
            label="Adjust Amount ($)"
            type="number"
            fullWidth
            value={adjustAmount}
            onChange={(e) => setAdjustAmount(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdjust}>Cancel</Button>
          <Button onClick={handleSubmitAdjust} variant="contained" color="primary">
            Adjust
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentTracking;
