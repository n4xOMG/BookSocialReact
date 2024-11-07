import React from "react";
import { TextField, Typography, Box } from "@mui/material";
export default function BasicInfoStep({ bookInfo, handleInputChange }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Title"
        id="title"
        name="title"
        value={bookInfo.title}
        onChange={handleInputChange}
        placeholder="Enter book title"
        required
        fullWidth
      />

      <TextField
        label="Author Name"
        id="authorName"
        name="authorName"
        value={bookInfo.authorName}
        onChange={handleInputChange}
        placeholder="Enter author name"
        required
        fullWidth
      />

      <TextField
        label="Artist Name (Optional)"
        id="artistName"
        name="artistName"
        value={bookInfo.artistName}
        onChange={handleInputChange}
        placeholder="Enter artist name"
        fullWidth
      />

      <Box>
        <TextField
          label="Description"
          id="description"
          name="description"
          value={bookInfo.description}
          onChange={handleInputChange}
          placeholder="Enter book description"
          required
          multiline
          rows={4}
          fullWidth
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {bookInfo.description.length}/500 characters
        </Typography>
      </Box>
    </Box>
  );
}
