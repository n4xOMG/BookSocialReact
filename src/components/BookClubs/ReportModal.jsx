import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React from "react";

export default function ReportModal({ open, onClose, reportReason, setReportReason, handleSubmitReport }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="report-modal-title"
      aria-describedby="report-modal-description"
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          maxWidth: 500,
          background: (theme) => (theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "20px",
          border: "1px solid",
          borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"),
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.3)",
          p: 4,
        }}
      >
        <Typography
          id="report-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: "1.5rem",
            mb: 2,
            background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
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
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"),
              backdropFilter: "blur(8px)",
            },
          }}
        />
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
          <Button
            variant="contained"
            onClick={handleSubmitReport}
            disabled={!reportReason.trim()}
            sx={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
              color: "#fff",
              fontWeight: 600,
              px: 3,
              py: 1,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #ff7b7b, #ff6b6b)",
                boxShadow: "0 6px 20px rgba(255, 107, 107, 0.4)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "rgba(255, 107, 107, 0.3)",
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: "12px",
              borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"),
              color: "text.primary",
              fontWeight: 600,
              px: 3,
              py: 1,
              textTransform: "none",
              background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"),
              backdropFilter: "blur(8px)",
              "&:hover": {
                borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"),
                background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)"),
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
