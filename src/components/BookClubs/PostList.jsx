import React from "react";
import { Box, Typography, Alert, Skeleton, Card, CardHeader, CardContent, useTheme } from "@mui/material";
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
  const theme = useTheme();

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
          py: 8,
          borderRadius: "16px",
          bgcolor: theme.palette.background.paper,
          border: "1px solid",
          borderColor: theme.palette.divider,
        }}
      >
        <Typography
          variant="h6"
          className="font-serif"
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          No posts yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
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
