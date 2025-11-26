import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React from "react";

export default function ShareModal({ openShareModal, setOpenShareModal, shareContent, setShareContent, handleShare }) {
  return (
    <Modal
      open={openShareModal}
      onClose={() => setOpenShareModal(false)}
      aria-labelledby="share-post-modal"
      aria-describedby="modal-to-share-post"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 300, sm: 400 },
          background: (theme) => (theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.95)" : "rgba(248, 247, 244, 0.95)"),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.3)" : "rgba(157, 80, 187, 0.2)"),
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          p: 4,
          borderRadius: "24px",
        }}
      >
        <Typography
          id="share-post-modal"
          variant="h6"
          component="h2"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Share Post
        </Typography>
        <TextField
          label="Add a comment (optional)"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={shareContent}
          onChange={(e) => setShareContent(e.target.value)}
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)"),
              backdropFilter: "blur(8px)",
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenShareModal(false)}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              color: (theme) => (theme.palette.mode === "dark" ? "#ff6b6b" : "#ee5a52"),
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleShare}
            disabled={shareContent.trim().length === 0 && !shareContent}
            sx={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(157, 80, 187, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #b968c7, #9d50bb)",
                boxShadow: "0 6px 24px rgba(157, 80, 187, 0.5)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "rgba(157, 80, 187, 0.3)",
              },
            }}
          >
            Share
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
