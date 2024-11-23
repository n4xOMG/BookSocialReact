import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useSelector } from "react-redux";

const NotificationList = () => {
  const { notifications, loading, error } = useSelector((state) => state.notification);

  return (
    <Box sx={{ width: 300, borderLeft: "1px solid #ddd", overflowY: "auto" }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Notifications
      </Typography>
      {loading ? (
        <Typography sx={{ p: 2 }}>Loading...</Typography>
      ) : error ? (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      ) : (
        <List>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem alignItems="flex-start">
                <ListItemText primary={notification.message} secondary={new Date(notification.createdDate).toLocaleString()} />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationList;
