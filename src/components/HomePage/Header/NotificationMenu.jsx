import { Notifications } from "@mui/icons-material";
import { Badge, Box, Divider, IconButton, Menu, Paper, Typography } from "@mui/material";
import React, { useState } from "react";

export default function NotificationMenu({ notifications }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={4} color="primary">
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400, overflow: "auto", p: 2 },
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, fontSize: 22 }}>
          Notifcations
        </Typography>
        <Paper sx={{ maxHeight: 300, overflowY: "auto" }}>
          {notifications?.map((noti, index) => (
            <Box
              key={noti?.id}
              sx={{
                backgroundColor: "white",
                color: "black",
                cursor: "pointer",
                px: 1,
                "&:hover": {
                  backgroundColor: "#f2f2f2",
                  color: "black",
                },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">{noti?.content}</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {noti?.time}
                </Typography>
              </Box>
              {index < notifications?.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))}
        </Paper>
      </Menu>
    </div>
  );
}
