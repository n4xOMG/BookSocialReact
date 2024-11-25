// UserInfo.jsx
import { Avatar, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

const UserInfo = ({ user, handleMessageClick }) => {
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

            <Button variant="contained" color="primary" onClick={handleMessageClick}>
              Message
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
