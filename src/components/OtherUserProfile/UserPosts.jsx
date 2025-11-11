import { Card, CardContent, List, Typography } from "@mui/material";
import { useAuthCheck } from "../../utils/useAuthCheck";
import PostItem from "../BookClubs/PostItem";

const UserPosts = ({ posts }) => {
  const { checkAuth } = useAuthCheck();
  const hasPosts = Array.isArray(posts) && posts.length > 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
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
