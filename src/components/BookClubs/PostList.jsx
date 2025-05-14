import React from "react";
import { Box, Typography, Alert, Skeleton, Card, CardHeader, CardContent } from "@mui/material";
import PostItem from "./PostItem";

const PostSkeleton = () => (
  <Card sx={{ mb: 3, borderRadius: 2 }}>
    <CardHeader
      avatar={<Skeleton variant="circular" width={48} height={48} />}
      title={<Skeleton variant="text" width="40%" />}
      subheader={<Skeleton variant="text" width="25%" />}
    />
    <CardContent>
      <Skeleton variant="text" height={80} />
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="rectangular" height={200} />
      </Box>
    </CardContent>
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="90%" />
    </Box>
  </Card>
);

const PostList = ({ posts, loading, error, checkAuth }) => {
  if (loading) {
    // Show skeletons while loading
    return (
      <Box>
        {[1, 2, 3].map((skeleton) => (
          <PostSkeleton key={skeleton} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading posts: {error}
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 5,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No posts yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Be the first to share something with the community!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} checkAuth={checkAuth} />
      ))}
    </Box>
  );
};

export default PostList;
