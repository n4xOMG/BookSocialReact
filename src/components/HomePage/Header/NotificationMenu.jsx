import { Notifications } from "@mui/icons-material";
import { Badge, Box, Divider, IconButton, Menu, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../../redux/notification/notification.action";
import LoadingSpinner from "../../LoadingSpinner";

export default function NotificationMenu() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getNotifications());
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Badge badgeContent={notifications?.length} color="primary">
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
                    <Typography variant="body2">{noti?.message}</Typography>
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
      )}
    </>
  );
}
