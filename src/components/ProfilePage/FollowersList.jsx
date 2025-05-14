import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Avatar, Box, Button, Divider, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFollowers } from "../../redux/user/user.action";

const FollowersList = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { userFollowers } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        dispatch(getUserFollowers(userId));
      } catch (err) {
        setError("Failed to load followers.");
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        {[1, 2, 3, 4].map((item) => (
          <Box key={item} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
            <Box>
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="text" width={160} height={18} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="outlined" color="primary" sx={{ mt: 2, borderRadius: 2 }} onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Paper>
    );
  }

  if (userFollowers.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 3,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/BLANK.jpg/138px-BLANK.jpg"
          alt="No followers"
          sx={{
            width: 180,
            height: 180,
            mb: 3,
            opacity: 0.8,
          }}
        />
        <Typography variant="h6" gutterBottom>
          No Followers Yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 3 }}>
          When people follow you, they'll appear here. Share your profile to connect with more readers!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.background.paper }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Your Followers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {userFollowers.length} {userFollowers.length === 1 ? "person" : "people"} following you
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {userFollowers?.map((follower) => (
            <Grid item xs={12} sm={6} md={4} key={follower.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <Avatar
                  src={follower.avatarUrl}
                  alt={follower.fullname}
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" noWrap>
                    {follower.fullname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    @{follower.username}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PersonAddIcon fontSize="small" />}
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      borderRadius: 5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Follow Back
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default FollowersList;
