import React from "react";
import { Paper, Typography } from "@mui/material";

/**
 * Constants for user color generation
 */
export const USER_COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

/**
 * Generate a random user color from predefined colors
 */
export const getRandomUserColor = () => {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
};

/**
 * Generate a random username for anonymous users
 */
export const getRandomUsername = () => `User-${Math.floor(Math.random() * 10000)}`;

/**
 * Generate user info for collaboration session
 */
export const generateUserInfo = () => ({
  name: getRandomUsername(),
  color: getRandomUserColor(),
});

/**
 * Loading component for the editor
 */
export const LoadingEditor = () => (
  <Paper
    elevation={3}
    sx={{
      p: 4,
      m: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "300px",
    }}
  >
    <Typography variant="h5">Loading editor...</Typography>
  </Paper>
);

/**
 * Error component for missing room ID
 */
export const RoomIdError = () => (
  <Paper elevation={3} sx={{ p: 4, m: 2, textAlign: "center" }}>
    <Typography variant="h6" color="error">
      Room ID is missing!
    </Typography>
  </Paper>
);

/**
 * Error component for chapter not loaded
 */
export const ChapterError = () => (
  <Paper elevation={3} sx={{ p: 4, m: 2, textAlign: "center" }}>
    <Typography variant="h6" color="error">
      Error: Chapter data not loaded
    </Typography>
  </Paper>
);
