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
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
        }}
      >
        <Typography id="share-post-modal" variant="h6" component="h2">
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
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => setOpenShareModal(false)} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleShare} disabled={shareContent.trim().length === 0 && !shareContent}>
            Share
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
