import { AppBar, Toolbar, Typography, IconButton, Stack, Tooltip, useTheme } from "@mui/material";
import { Logout, Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ toggleTheme }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(18, 18, 18, 0.7)" : "rgba(255, 255, 255, 0.7)"),
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        color: "text.primary",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
        borderBottom: (t) => `1px solid ${t.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(45deg, #FFEB3B 30%, #FBC02D 90%)"
                : "linear-gradient(45deg, #1d6d53 30%, #4a8a75 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Admin Dashboard
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "rotate(180deg) scale(1.1)",
                  backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 235, 59, 0.15)" : "rgba(29, 109, 83, 0.15)"),
                },
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton
              color="error"
              onClick={() => {
                navigate("/");
              }}
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  backgroundColor: "rgba(244, 67, 54, 0.15)",
                },
              }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
