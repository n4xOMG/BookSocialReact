// UserInfo.jsx
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Avatar, Box, Button, Card, CardContent, Grid, Typography, useTheme } from "@mui/material";
import React from "react";

const UserInfo = ({ user, handleMessageClick, isBlocked, onBlockToggle, blockLoading, disableActions }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: "24px",
        background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.7)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.2)" : "rgba(157, 80, 187, 0.15)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={user?.avatarUrl}
              alt={user?.username}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid",
                borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.5)" : "rgba(157, 80, 187, 0.3)",
                boxShadow: "0 8px 24px rgba(157, 80, 187, 0.4)",
              }}
            />
          </Grid>
          <Grid item xs>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textAlign: 'left',
                mb: 1,
              }}
            >
              {user?.username}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 2,
                textAlign: 'left',
              }}
            >
              {user?.bio}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleMessageClick}
                disabled={isBlocked || disableActions}
                sx={{
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                  color: "#fff",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
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
                Message
              </Button>
              {!disableActions && (
                <Button
                  variant="outlined"
                  color={isBlocked ? "primary" : "error"}
                  startIcon={isBlocked ? <LockOpenIcon /> : <BlockIcon />}
                  onClick={onBlockToggle}
                  disabled={blockLoading}
                  sx={{
                    borderRadius: "12px",
                    borderWidth: 2,
                    borderColor: isBlocked ? "#9d50bb" : "#ff6b6b",
                    color: isBlocked ? "#9d50bb" : "#ff6b6b",
                    background:
                      theme.palette.mode === "dark"
                        ? isBlocked
                          ? "rgba(157, 80, 187, 0.1)"
                          : "rgba(255, 107, 107, 0.1)"
                        : isBlocked
                        ? "rgba(157, 80, 187, 0.05)"
                        : "rgba(255, 107, 107, 0.05)",
                    backdropFilter: "blur(8px)",
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: isBlocked ? "#b968c7" : "#ee5a52",
                      background:
                        theme.palette.mode === "dark"
                          ? isBlocked
                            ? "rgba(157, 80, 187, 0.2)"
                            : "rgba(255, 107, 107, 0.2)"
                          : isBlocked
                          ? "rgba(157, 80, 187, 0.15)"
                          : "rgba(255, 107, 107, 0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {isBlocked ? "Unblock" : "Block"}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
