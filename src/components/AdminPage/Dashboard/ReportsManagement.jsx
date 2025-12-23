import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteReportedObjectAction, getAllReportsAction } from "../../../redux/report/report.action";
import LoadingSpinner from "../../LoadingSpinner";
import ReportDetailsDialog from "./ReportDetailsDialog";
import { useTheme } from "@emotion/react";
const ReportsManagement = () => {
  const { reports = [] } = useSelector((state) => state.report);
  const { navigate } = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [actionDialog, setActionDialog] = useState({
    open: false,
    report: null,
    action: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    report: null,
  });
  const fetchReports = async () => {
    setLoading(true);
    try {
      dispatch(getAllReportsAction());
    } catch (error) {
      console.error("Error fetching reports:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch reports.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);
  // Handle opening the action dialog
  const handleOpenDialog = (report, action) => {
    setActionDialog({ open: true, report, action });
  };

  // Handle closing the action dialog
  const handleCloseDialog = () => {
    setActionDialog({ open: false, report: null, action: "" });
  };

  // Handle performing the action
  const handlePerformAction = async () => {
    const { report, action } = actionDialog;
    try {
      switch (action) {
        case "delete":
          dispatch(deleteReportedObjectAction(report.id));
          setSnackbar({
            open: true,
            message: "Reported object deleted successfully.",
            severity: "success",
          });
          break;
        default:
          break;
      }
      // Refresh reports after action
      fetchReports();
    } catch (error) {
      console.error(`Error performing ${action} on report ${report.id}:`, error);
      setSnackbar({
        open: true,
        message: `Failed to ${action} the report.`,
        severity: "error",
      });
    } finally {
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleOpenDetailsDialog = (report) => {
    setDetailsDialog({ open: true, report });
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialog({ open: false, report: null });
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports Management
      </Typography>

      {loading ? (
        <LoadingSpinner />
      ) : isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {reports.map((report) => (
              <Paper key={report.id} sx={{ p: 2, borderRadius: 2 }}>
                <Typography fontWeight={600}>Report #{report.id}</Typography>

                <Typography variant="body2" color="text.secondary">
                  Reason: {report.reason}
                </Typography>

                <Typography variant="body2">
                  Status: {report.resolved ? "Resolved" : "Pending"}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                  <IconButton onClick={() => handleOpenDetailsDialog(report)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDialog(report, "delete")}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="reports table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Reported Object</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Reported Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports && reports.length > 0 ? (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.id}</TableCell>
                      <TableCell>
                        {report.book && report.book.title
                          ? `Book: ${report.book.title}`
                          : report.chapter && report.chapter.title
                          ? `Chapter: ${report.chapter.title}`
                          : report.comment && report.comment.content
                          ? `Comment: ${
                              report.comment.content.length > 50 ? `${report.comment.content.substring(0, 47)}...` : report.comment.content
                            }`
                          : "No Related Object"}
                      </TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{report.reporter ? `${report.reporter.fullname} (${report.reporter.username})` : "Unknown"}</TableCell>
                      <TableCell>{report.reportedDate ? new Date(report.reportedDate).toLocaleString() : "Unknown"}</TableCell>
                      <TableCell>{report.resolved ? "Resolved" : "Pending"}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Show Details">
                          <IconButton color="primary" onClick={() => handleOpenDetailsDialog(report)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Object">
                          <IconButton color="error" onClick={() => handleOpenDialog(report, "delete")}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No reports available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        <DialogTitle id="action-dialog-title">{actionDialog.action === "delete" && "Delete Reported Object"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="action-dialog-description">
            {actionDialog.action === "delete" && "Are you sure you want to delete the reported object?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePerformAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {detailsDialog.open && <ReportDetailsDialog detailsDialog={detailsDialog} handleCloseDetailsDialog={handleCloseDetailsDialog} />}
    </Box>
  );
};

export default ReportsManagement;
