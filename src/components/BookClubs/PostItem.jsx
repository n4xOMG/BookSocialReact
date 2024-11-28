import { Delete, Edit, Favorite, Message, Share } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, CardHeader, Grid, IconButton, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, likePost } from "../../redux/post/post.action";
import CommentSection from "./CommentSection";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";

const PostItem = ({ post, onEdit, checkAuth }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(user ? isFavouredByReqUser(user, post) : false);

  const handleLike = useCallback(
    checkAuth(async () => {
      try {
        setTimeout(() => {
          dispatch(likePost(post.id));
          setIsLiked((prev) => !prev);
        }, 300);
      } catch (e) {
        setIsLiked((prev) => !prev);
        console.log("Error follow book: ", e);
      }
    }),
    [dispatch, isLiked]
  );

  const handleDelete = () => {
    dispatch(deletePost(post.id));
  };

  const handleEdit = () => {
    onEdit(post);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={<Avatar src={post.user.avatarUrl || "/placeholder.svg"} alt={post.user.fullname} />}
        title={<Typography variant="h6">{post.user.fullname}</Typography>}
        subheader={post.timestamp ? new Date(post.timestamp).toLocaleString() : ""}
        action={
          user &&
          user.id === post.user.id && (
            <>
              <IconButton onClick={handleEdit}>
                <Edit />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <Delete />
              </IconButton>
            </>
          )
        }
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
        <IconButton onClick={handleLike}>
          <Favorite color={isLiked ? "error" : "inherit"} />
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
  );
};

export default PostItem;
