import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import React from "react";
export default function SettingsStep({ bookInfo, handleInputChange, setBookInfo }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Upload Date"
        id="uploadDate"
        name="uploadDate"
        type="date"
        value={bookInfo.uploadDate}
        onChange={handleInputChange}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
      />

      <FormControl fullWidth>
        <InputLabel id="language-label">Language</InputLabel>
        <Select
          labelId="language-label"
          id="language"
          name="language"
          value={bookInfo.language}
          onChange={(e) => setBookInfo((prev) => ({ ...prev, language: e.target.value }))}
          label="Language"
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="fr">French</MenuItem>
          <MenuItem value="de">German</MenuItem>
          <MenuItem value="ja">Japanese</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          id="status"
          name="status"
          value={bookInfo.status}
          onChange={(e) => setBookInfo((prev) => ({ ...prev, status: e.target.value }))}
          label="Status"
        >
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="ongoing">Ongoing</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
