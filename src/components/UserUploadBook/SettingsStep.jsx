import { Box, FormControl, InputLabel, MenuItem, Select, useTheme } from "@mui/material";

export default function SettingsStep({ bookInfo, setBookInfo }) {
  const theme = useTheme();

  const glassSelectStyle = {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(157, 80, 187, 0.5)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9d50bb",
      borderWidth: "2px",
    },
  };

  const labelStyle = {
    "&.Mui-focused": {
      color: "#9d50bb",
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="language-label" sx={labelStyle}>
          Language
        </InputLabel>
        <Select
          labelId="language-label"
          name="language"
          value={bookInfo.language}
          onChange={(e) => setBookInfo((prev) => ({ ...prev, language: e.target.value }))}
          label="Language"
          sx={glassSelectStyle}
        >
          <MenuItem value="vn">Vietnamese</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="fr">French</MenuItem>
          <MenuItem value="de">German</MenuItem>
          <MenuItem value="ja">Japanese</MenuItem>
          <MenuItem value="ko">Korean</MenuItem>
          <MenuItem value="zh">Chinese</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="status-label" sx={labelStyle}>
          Status
        </InputLabel>
        <Select
          labelId="status-label"
          name="status"
          value={bookInfo.status}
          onChange={(e) => setBookInfo((prev) => ({ ...prev, status: e.target.value }))}
          label="Status"
          sx={glassSelectStyle}
        >
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="ongoing">Ongoing</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
