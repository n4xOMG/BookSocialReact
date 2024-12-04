import { Avatar, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReadingProgressByUser } from "../../redux/user/user.action";

const ReadingHistory = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { readingProgresses = [] } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchReadingHistory = async () => {
      try {
        dispatch(getReadingProgressByUser());
      } catch (err) {
        setError("Failed to load reading history.");
      } finally {
        setLoading(false);
      }
    };
    fetchReadingHistory();
  }, [userId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (readingProgresses?.length === 0) {
    return <Typography>No reading history yet.</Typography>;
  }

  return (
    <List>
      {readingProgresses?.map((item) => (
        <ListItem key={item.id}>
          <ListItemAvatar>
            <Avatar src={item.bookCover} alt={item.bookTitle} />
          </ListItemAvatar>
          <ListItemText
            primary={item.bookTitle}
            secondary={`Chapter ${item.chapterNum}: ${item.chapterName} - ${item.progress.toFixed(2)}%`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ReadingHistory;
