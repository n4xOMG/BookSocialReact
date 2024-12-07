import { Avatar, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (userFollowers.length === 0) {
    return <Typography>No followers yet.</Typography>;
  }

  return (
    <List>
      {userFollowers?.map((follower) => (
        <ListItem key={follower.id}>
          <ListItemAvatar>
            <Avatar src={follower.avatarUrl} alt={follower.fullname} />
          </ListItemAvatar>
          <ListItemText primary={follower.fullname} secondary={`@${follower.username}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default FollowersList;
