import { Card, CardContent, List, Typography } from "@mui/material";
import { useAuthCheck } from "../../utils/useAuthCheck";
import PostItem from "../BookClubs/PostItem";
const UserPosts = ({ posts }) => {
  const { checkAuth } = useAuthCheck();
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Posts
        </Typography>
        <List>
          {posts.map((post) => (
            <PostItem post={post} checkAuth={checkAuth} />
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserPosts;
