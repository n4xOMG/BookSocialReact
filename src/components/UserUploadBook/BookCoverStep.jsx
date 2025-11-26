import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Typography, useTheme } from "@mui/material";

export default function BookCoverStep({ bookInfo, handleFileChange }) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: 240,
          border: `2px dashed ${theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.3)" : "rgba(157, 80, 187, 0.4)"}`,
          borderRadius: "16px",
          cursor: "pointer",
          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.08)" : "rgba(157, 80, 187, 0.05)",
            borderColor: "#9d50bb",
            transform: "translateY(-2px)",
          },
        }}
        component="label"
        htmlFor="coverImage"
      >
        <Box sx={{ textAlign: "center", p: 3 }}>
          <UploadIcon
            sx={{
              fontSize: 56,
              color: "#9d50bb",
              mb: 2,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Click to upload or drag and drop
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PNG, JPG or GIF (Recommended: 800x1200px)
          </Typography>
        </Box>
        <input type="file" id="coverImage" name="coverImage" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      </Box>

      {bookInfo.bookCover && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#00c9a7",
            }}
          >
            <CheckCircleIcon />
            <Typography variant="body2" fontWeight={600}>
              Cover uploaded successfully
            </Typography>
          </Box>
          <Box
            sx={{
              position: "relative",
              maxWidth: 320,
              width: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              border: `2px solid ${theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.3)" : "rgba(157, 80, 187, 0.2)"}`,
              boxShadow: "0 8px 24px rgba(157, 80, 187, 0.2)",
            }}
          >
            <img
              src={bookInfo.bookCover}
              alt="Book cover preview"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
