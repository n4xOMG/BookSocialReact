import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React from "react";

export default function ReportModal({ open, onClose, reportReason, setReportReason, handleSubmitReport }) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="report-modal-title" aria-describedby="report-modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="report-modal-title" variant="h6" component="h2" gutterBottom>
          Report Comment
        </Typography>
        <TextField
          id="report-reason"
          label="Reason"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="contained" color="primary" onClick={handleSubmitReport} disabled={!reportReason.trim()}>
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
