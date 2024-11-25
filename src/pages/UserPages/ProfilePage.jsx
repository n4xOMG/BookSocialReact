import { Alert, Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AccountInfo from "../../components/ProfilePage/AccountInfo";
import PersonalInfo from "../../components/ProfilePage/PersonalInfo";
import { getCurrentUserByJwt } from "../../redux/auth/auth.action";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        const userData = await dispatch(getCurrentUserByJwt(jwt));
        setUser(userData.payload);
      } catch (err) {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {user.fullname}'s Profile
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <PersonalInfo user={user} setUser={setUser} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AccountInfo user={user} setUser={setUser} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
