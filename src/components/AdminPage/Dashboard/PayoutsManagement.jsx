import React, { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import { adminListPayouts, adminProcessPayout } from "../../../redux/adminPayout/adminPayout.action";
import { format } from "date-fns";

const currency = (n) => (n == null ? "-$" : `$${Number(n).toFixed(2)}`);

const statusOptions = [
  { label: "All", value: "" },
  { label: "Requested", value: "REQUESTED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
];

const sortOptions = [
  { label: "Requested Date (newest)", value: "requestedDate,desc" },
  { label: "Requested Date (oldest)", value: "requestedDate,asc" },
  { label: "Amount (high)", value: "totalAmount,desc" },
  { label: "Amount (low)", value: "totalAmount,asc" },
];

const PayoutsManagement = () => {
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
    return <Chip size="small" color={color} label={s} />;
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Author Payouts
      </Typography>
      {loading && !payoutsPage && (
        <Box sx={{ p: 2 }}>
          <LinearProgress />
        </Box>
      )}
      {error && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography color="error">{String(error)}</Typography>
          </CardContent>
        </Card>
      )}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 200 }}>
          {statusOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} sx={{ minWidth: 240 }}>
          {sortOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="outlined" onClick={() => load()}>
          Refresh
        </Button>
      </Stack>
      <Card>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Payout ID</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Platform Fees</TableCell>
                <TableCell>Requested</TableCell>
                <TableCell>Processed</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.authorName || p.author?.fullname || p.authorId}</TableCell>
                  <TableCell>{statusChip(p.status)}</TableCell>
                  <TableCell align="right">{currency(p.totalAmount)}</TableCell>
                  <TableCell align="right">{currency(p.platformFeesDeducted)}</TableCell>
                  <TableCell>{p.requestedDate ? format(new Date(p.requestedDate), "MMM d, yyyy") : "-"}</TableCell>
                  <TableCell>{p.processedDate ? format(new Date(p.processedDate), "MMM d, yyyy") : "-"}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      disabled={processingMap[p.id] || p.status === "COMPLETED"}
                      onClick={() => handleProcess(p.id)}
                    >
                      {processingMap[p.id] ? "Processing..." : "Process"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography variant="body2" color="text.secondary">
                      No payouts found
                    </Typography>
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
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default PayoutsManagement;
