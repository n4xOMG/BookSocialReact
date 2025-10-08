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
        backgroundColor: "background.paper",
        color: "text.primary",
        boxShadow: "none",
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          Admin Dashboard
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton
              color="error"
              onClick={() => {
                navigate("/");
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
