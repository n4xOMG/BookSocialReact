import { Avatar, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFollowings } from "../../redux/user/user.action";

const FollowingList = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { userFollowings } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        dispatch(getUserFollowings(userId));
      } catch (err) {
        setError("Failed to load following.");
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [userId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (userFollowings?.length === 0) {
    return <Typography>Not following anyone yet.</Typography>;
  }

  return (
    <List>
      {userFollowings?.map((user) => (
        <ListItem key={user.id}>
          <ListItemAvatar>
            <Avatar src={user.avatarUrl} alt={user.fullname} />
          </ListItemAvatar>
          <ListItemText primary={user.fullname} secondary={`@${user.username}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default FollowingList;
