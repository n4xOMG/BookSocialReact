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
          borderRadius: "24px",
          background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.6)"),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(0, 201, 167, 0.2)" : "rgba(0, 201, 167, 0.15)"),
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #00c9a7, #56efca)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          No posts yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
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
