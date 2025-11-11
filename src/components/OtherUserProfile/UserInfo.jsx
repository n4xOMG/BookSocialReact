// UserInfo.jsx
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Avatar, Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

const UserInfo = ({ user, handleMessageClick, isBlocked, onBlockToggle, blockLoading, disableActions }) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={user?.avatarUrl} alt={user?.username} sx={{ width: 100, height: 100 }} />
          </Grid>
          <Grid item>
            <Typography variant="h5">{user?.username}</Typography>
            <Typography variant="body1">{user?.bio}</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleMessageClick} disabled={isBlocked || disableActions}>
                Message
              </Button>
              {!disableActions && (
                <Button
                  variant="outlined"
                  color={isBlocked ? "primary" : "error"}
                  startIcon={isBlocked ? <LockOpenIcon /> : <BlockIcon />}
                  onClick={onBlockToggle}
                  disabled={blockLoading}
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
