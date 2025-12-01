import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  useTheme,
  Paper,
  TableContainer,
  Alert,
} from "@mui/material";
import { adminListPayouts, adminProcessPayout } from "../../../redux/adminPayout/adminPayout.action";
import { format } from "date-fns";
import { Refresh } from "@mui/icons-material";

const currency = (n) => (n == null ? "-$" : `$${Number(n).toFixed(2)}`);

const statusOptions = [
  { label: "All Statuses", value: "" },
  { label: "Requested", value: "REQUESTED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
];

const sortOptions = [
  { label: "Newest First", value: "requestedDate,desc" },
  { label: "Oldest First", value: "requestedDate,asc" },
  { label: "Amount (High-Low)", value: "totalAmount,desc" },
  { label: "Amount (Low-High)", value: "totalAmount,asc" },
];

const PayoutsManagement = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { payoutsPage, loading, error, processingMap } = useSelector((s) => s.adminPayout);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("requestedDate,desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const load = () => dispatch(adminListPayouts({ status: status || undefined, page, size: rowsPerPage, sort }));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sort, page, rowsPerPage]);

  const rows = payoutsPage?.content || [];
  const total = payoutsPage?.totalElements || 0;

  const handleProcess = async (id) => {
    await dispatch(adminProcessPayout(id));
  };

  const statusChip = (s) => {
    const color = s === "COMPLETED" ? "success" : s === "FAILED" ? "error" : s === "PROCESSING" ? "info" : "warning";
    return <Chip size="small" color={color} label={s} sx={{ fontWeight: 600 }} />;
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" className="font-serif" fontWeight="700" sx={{ color: theme.palette.text.primary }}>
            Payouts Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Process and track author payout requests.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => load()}
          sx={{ borderRadius: "8px" }}
        >
          Refresh
        </Button>
      </Box>

      {loading && !payoutsPage && (
        <Box sx={{ p: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
          {String(error)}
        </Alert>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          size="small"
          sx={{
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: theme.palette.background.paper,
            },
          }}
        >
          {statusOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sort By"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          size="small"
          sx={{
            minWidth: 240,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: theme.palette.background.paper,
            },
          }}
        >
          {sortOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: theme.palette.divider,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
              <TableCell sx={{ fontWeight: 600 }}>Payout ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Fees</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Requested</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Processed</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{p.id.substring(0, 8)}...</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{p.authorName || p.author?.fullname || "Unknown"}</TableCell>
                <TableCell>{statusChip(p.status)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                  {currency(p.totalAmount)}
                </TableCell>
                <TableCell align="right" sx={{ color: theme.palette.text.secondary }}>
                  {currency(p.platformFeesDeducted)}
                </TableCell>
                <TableCell>{p.requestedDate ? format(new Date(p.requestedDate), "MMM d, yyyy") : "-"}</TableCell>
                <TableCell>{p.processedDate ? format(new Date(p.processedDate), "MMM d, yyyy") : "-"}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    disabled={processingMap[p.id] || p.status === "COMPLETED"}
                    onClick={() => handleProcess(p.id)}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": { boxShadow: "none" },
                    }}
                  >
                    {processingMap[p.id] ? "Processing..." : "Process"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No payouts found matching your criteria.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </TableContainer>
    </Box>
  );
};

export default PayoutsManagement;
