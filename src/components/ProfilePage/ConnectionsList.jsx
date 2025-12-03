import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Avatar, Box, Button, Divider, Grid, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { blockUser, getBlockedUsers, getUserFollowers, getUserFollowings, unblockUser } from "../../redux/user/user.action";

const PLACEHOLDER_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/BLANK.jpg/138px-BLANK.jpg";

const VARIANT_META = {
  followers: {
    title: "Your Followers",
    emptyTitle: "No Followers Yet",
    emptyDescription: "When people follow you, they'll appear here. Share your profile to connect with more readers!",
    actionLabel: "Block",
    actionColor: "error",
    ActionIcon: BlockIcon,
  },
  following: {
    title: "People You Follow",
    emptyTitle: "You're Not Following Anyone Yet",
    emptyDescription: "Follow authors and other readers to keep up with their activities and recommendations.",
    actionLabel: "Block",
    actionColor: "error",
    ActionIcon: BlockIcon,
  },
  blocked: {
    title: "Blocked Users",
    emptyTitle: "You Haven't Blocked Anyone",
    emptyDescription:
      "Use the block option on followers or following lists to prevent unwanted interactions. Blocked users will appear here.",
    actionLabel: "Unblock",
    actionColor: "primary",
    ActionIcon: LockOpenIcon,
  },
};

const ConnectionsList = ({ userId, variant }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const { userFollowers, userFollowings, blockedUsers } = useSelector((state) => state.user);
  const dataset = useMemo(() => {
    switch (variant) {
      case "followers":
        return userFollowers;
      case "following":
        return userFollowings;
      case "blocked":
      default:
        return blockedUsers;
    }
  }, [blockedUsers, userFollowers, userFollowings, variant]);

  const theme = useTheme();

  const fetchConnections = useCallback(async () => {
    if ((variant === "followers" || variant === "following") && !userId) {
      return;
    }

    if (variant === "followers") {
      await dispatch(getUserFollowers(userId));
    } else if (variant === "following") {
      await dispatch(getUserFollowings(userId));
    } else {
      await dispatch(getBlockedUsers());
    }
  }, [dispatch, userId, variant]);

  const performAction = useCallback(
    (user) => {
      if (variant === "blocked") {
        return dispatch(unblockUser(user.id));
      }
      return dispatch(blockUser(user.id));
    },
    [dispatch, variant]
  );

  useEffect(() => {
    let isMounted = true;

    const loadConnections = async () => {
      if ((variant === "followers" || variant === "following") && !userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        await fetchConnections();
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadConnections();

    return () => {
      isMounted = false;
    };
  }, [fetchConnections, userId, variant]);

  const meta = VARIANT_META[variant];
  const ActionIconComponent = meta?.ActionIcon;

  const users = Array.isArray(dataset) ? dataset : [];

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
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchConnections()
              .catch((err) => setError(err.message || "Failed to reload."))
              .finally(() => setLoading(false));
          }}
        >
          Try Again
        </Button>
      </Paper>
    );
  }

  if (users.length === 0) {
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
        <Box component="img" src={PLACEHOLDER_IMAGE} alt="No data" sx={{ width: 180, height: 180, mb: 3, opacity: 0.8 }} />
        <Typography variant="h6" gutterBottom>
          {meta?.emptyTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
          {meta?.emptyDescription}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          fontWeight="medium"
          sx={{
            fontFamily: '"Playfair Display", serif',
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {meta?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {users.length} {users.length === 1 ? "person" : "people"}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {users.map((user) => {
            const displayName = user.fullname || user.username;
            const subtitle = user.username ? `@${user.username}` : user.bio;
            return (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.3s",
                    background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid",
                    borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                      background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.1)" : "rgba(157, 80, 187, 0.08)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(157, 80, 187, 0.2)",
                      borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.3)" : "rgba(157, 80, 187, 0.2)",
                    },
                  }}
                >
                  <Avatar
                    src={user.avatarUrl || null}
                    alt={displayName}
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 2,
                      border: "2px solid",
                      borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.3)" : "rgba(157, 80, 187, 0.2)",
                      boxShadow: "0 4px 12px rgba(157, 80, 187, 0.2)",
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight="medium" noWrap>
                      {displayName || "Unknown User"}
                    </Typography>
                    {subtitle && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {subtitle}
                      </Typography>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color={meta?.actionColor}
                      startIcon={ActionIconComponent ? <ActionIconComponent fontSize="small" /> : null}
                      sx={{ mt: 1, textTransform: "none", borderRadius: 5, fontSize: "0.75rem" }}
                      onClick={async () => {
                        try {
                          setPendingId(user.id);
                          await performAction(user);
                        } catch (err) {
                          setError(err.message || "Unable to update user.");
                        } finally {
                          setPendingId(null);
                        }
                      }}
                      disabled={pendingId === user.id}
                    >
                      {pendingId === user.id ? `${meta?.actionLabel}ing...` : meta?.actionLabel}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Paper>
  );
};

ConnectionsList.propTypes = {
  userId: PropTypes.string,
  variant: PropTypes.oneOf(["followers", "following", "blocked"]).isRequired,
};

export default ConnectionsList;
