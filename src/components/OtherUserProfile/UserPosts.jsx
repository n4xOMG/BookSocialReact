import { Avatar, Box, Card, CardContent, CardHeader, Grid, IconButton, List, Typography } from "@mui/material";
import React from "react";
import { likePost } from "../../redux/post/post.action";
import CommentSection from "../BookClubs/CommentSection";
import { useDispatch } from "react-redux";
import { Favorite, Message, Share } from "@mui/icons-material";

const UserPosts = ({ posts }) => {
  const dispatch = useDispatch();
  const handleLike = (id) => {
    dispatch(likePost(id));
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Posts
        </Typography>
        <List>
          {posts.map((post) => (
            <Card sx={{ mb: 3 }}>
              <CardHeader
                avatar={<Avatar src={post.user.avatarUrl || "/placeholder.svg"} alt={post.user.fullname} />}
                title={<Typography variant="h6">{post.user.fullname}</Typography>}
                subheader={post.timestamp ? new Date(post.timestamp).toLocaleString() : ""}
              />
              <CardContent>
                {post.content && (
                  <Typography variant="body1" gutterBottom>
                    {post.content}
                  </Typography>
                )}
                {post.images && post.images.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      {post.images.map((imageUrl, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            component="img"
                            src={imageUrl}
                            alt={`Post Image ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "auto",
                              objectFit: "cover",
                              borderRadius: 1,
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                <IconButton onClick={() => handleLike(post.id)}>
                  <Favorite color={post.likes > 0 ? "error" : "inherit"} />
                  {post.likes}
                </IconButton>
                <IconButton>
                  <Message /> {post.comments || 0}
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Box>
              <CommentSection postId={post.id} />
            </Card>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserPosts;
