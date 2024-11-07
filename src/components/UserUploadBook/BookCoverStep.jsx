import UploadIcon from "@mui/icons-material/Upload";
import { Box, Typography } from "@mui/material";
import React from "react";

export default function BookCoverStep({ bookInfo, handleFileChange }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Book Cover</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 200,
          border: "2px dashed",
          borderRadius: 1,
          cursor: "pointer",
          backgroundColor: "grey.100",
          "&:hover": { backgroundColor: "grey.200" },
        }}
        component="label"
        htmlFor="coverImage"
      >
        <Box sx={{ textAlign: "center" }}>
          <UploadIcon sx={{ fontSize: 40, color: "text.secondary" }} />
          <Typography variant="body1" color="text.secondary">
            <strong>Click to upload</strong> or drag and drop
          </Typography>
          <Typography variant="caption" color="text.secondary">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </Typography>
        </Box>
        <input type="file" id="coverImage" name="coverImage" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      </Box>
      {bookInfo.coverImage && (
        <Box mt={2}>
          <img src={bookInfo.coverImage} alt="Book cover preview" style={{ maxWidth: "100%", height: "auto" }} />
        </Box>
      )}
    </Box>
  );
}
