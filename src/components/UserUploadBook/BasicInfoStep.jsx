import { Box, TextField, Typography, useTheme } from "@mui/material";

export default function BasicInfoStep({ bookInfo, handleInputChange }) {
  const theme = useTheme();

  const glassFieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
      backdropFilter: "blur(8px)",
      borderRadius: "12px",
      "& fieldset": {
        borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(157, 80, 187, 0.5)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#9d50bb",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#9d50bb",
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TextField
        label="Title"
        name="title"
        value={bookInfo.title}
        onChange={handleInputChange}
        placeholder="Enter book title"
        required
        fullWidth
        sx={glassFieldStyle}
      />

      <TextField
        label="Author Name"
        name="authorName"
        value={bookInfo.authorName}
        onChange={handleInputChange}
        placeholder="Enter author name"
        required
        fullWidth
        sx={glassFieldStyle}
      />

      <TextField
        label="Artist Name (Optional)"
        name="artistName"
        value={bookInfo.artistName}
        onChange={handleInputChange}
        placeholder="Enter artist name"
        fullWidth
        sx={glassFieldStyle}
      />

      <Box>
        <TextField
          label="Description"
          name="description"
          value={bookInfo.description}
          onChange={handleInputChange}
          placeholder="Enter book description"
          required
          multiline
          rows={5}
          fullWidth
          inputProps={{ maxLength: 500 }}
          sx={{ ...glassFieldStyle, mb: 1.5 }}
        />
        <Typography
          variant="body2"
          sx={{
            color: bookInfo.description.length > 450 ? "#ff6b6b" : "text.secondary",
            fontWeight: bookInfo.description.length > 450 ? 600 : 400,
            textAlign: "right",
          }}
        >
          {bookInfo.description.length}/500 characters
        </Typography>
      </Box>
    </Box>
  );
}
