import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";

export default function ReportDetailsDialog({ detailsDialog, handleCloseDetailsDialog }) {
  return (
    <Dialog
      open={detailsDialog.open}
      onClose={handleCloseDetailsDialog}
      aria-labelledby="details-dialog-title"
      aria-describedby="details-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="details-dialog-title">Report Details</DialogTitle>
      <DialogContent dividers>
        {detailsDialog.report && (
          <>
            <Typography variant="h6" gutterBottom>
              Report ID: {detailsDialog.report.id}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Reason: {detailsDialog.report.reason}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Reporter:{" "}
              {detailsDialog.report.reporter
                ? `${detailsDialog.report.reporter.fullname} (${detailsDialog.report.reporter.username})`
                : "Unknown"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Reported Date: {detailsDialog.report.reportedDate ? new Date(detailsDialog.report.reportedDate).toLocaleString() : "Unknown"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Status: {detailsDialog.report.isResolved ? "Resolved" : "Pending"}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Reported Object Details:
              </Typography>
              {detailsDialog.report.book && detailsDialog.report.book.title && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Type: Book</Typography>
                  <Typography variant="body1">Title: {detailsDialog.report.book.title}</Typography>
                </Box>
              )}
              {detailsDialog.report.chapter && detailsDialog.report.chapter.title && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Type: Chapter</Typography>
                  <Typography variant="body1">Title: {detailsDialog.report.chapter.title}</Typography>
                </Box>
              )}
              {detailsDialog.report.comment && detailsDialog.report.comment.content && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Type: Comment</Typography>
                  <Typography variant="body1">Content: {detailsDialog.report.comment.content}</Typography>
                  {detailsDialog.report.comment.chapterId && (
                    <Typography variant="body2">Belongs to Chapter ID: {detailsDialog.report.comment.chapterId}</Typography>
                  )}
                  {detailsDialog.report.comment.bookId && (
                    <Typography variant="body2">Belongs to Book ID: {detailsDialog.report.comment.bookId}</Typography>
                  )}
                </Box>
              )}
              {!detailsDialog.report.book && !detailsDialog.report.chapter && !detailsDialog.report.comment && (
                <Typography variant="body1">No related object information available.</Typography>
              )}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetailsDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
