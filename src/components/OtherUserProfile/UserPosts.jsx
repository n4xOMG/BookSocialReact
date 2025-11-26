import { Card, CardContent, List, Typography, useTheme } from "@mui/material";
import { useAuthCheck } from "../../utils/useAuthCheck";
import PostItem from "../BookClubs/PostItem";

const UserPosts = ({ posts }) => {
  const { checkAuth } = useAuthCheck();
  const theme = useTheme();
  const hasPosts = Array.isArray(posts) && posts.length > 0;

  return (
    <Card
      sx={{
        borderRadius: "20px",
        background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.7)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.2)" : "rgba(157, 80, 187, 0.15)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: 2,
          }}
        >
          Posts
        </Typography>
        {hasPosts ? (
          <List>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} checkAuth={checkAuth} />
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No posts to display yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPosts;
