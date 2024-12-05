import React from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import PostItem from "./PostItem";

const PostList = ({ posts, loading, error, onEdit, checkAuth }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (posts.length === 0) {
    return <Typography>No posts available.</Typography>;
  }

  return (
    <Box>
      {posts?.map((post) => (
        <PostItem key={post.id} post={post} onEdit={onEdit} checkAuth={checkAuth} />
      ))}
    </Box>
  );
};

export default PostList;
