// UserInfo.jsx
import React from "react";
import { Card, CardContent, Avatar, Typography, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";

const UserInfo = ({ user }) => {
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
            <Button variant="contained" color="primary" component={Link} to={`/message/${user.id}`} sx={{ mt: 2 }}>
              Message
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
