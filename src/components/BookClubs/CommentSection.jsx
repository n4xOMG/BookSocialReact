import { Alert, Avatar, Box, Button, Snackbar, TextField, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPostCommentAction,
  createReplyPostCommentAction,
  deletepostCommentAction,
  fetchPostById,
} from "../../redux/post/post.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
import LoadingSpinner from "../LoadingSpinner";
import CommentItem from "./CommentItem";

const CommentSection = ({ comments, postId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState("");
  const [newReply, setNewReply] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { checkAuth, AuthDialog } = useAuthCheck();

  const handleAddComment = () => {
    if (!user) {
      alert("Please log in to comment.");
      return;
    }

    if (commentText.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }

    const reqData = {
      postId: postId,
      data: {
        content: commentText,
        userId: user.id,
      },
    };
    setLoading(true);
    try {
      dispatch(createPostCommentAction(reqData));
    } catch (error) {
      console.log("Error creating comment:", error);
      setLocalError(error.message);
      setOpen(true);
    } finally {
      setCommentText("");
      setLoading(false);
    }
  };
  const handleReplyChange = useCallback((event) => {
    setNewReply(event.target.value);
  }, []);
  const handleSubmitReply = useCallback(
    checkAuth(async (parentCommentId) => {
      if (newReply.trim()) {
        const reqData = {
          parentCommentId: parentCommentId,
          data: {
            content: newReply,
          },
        };
        const response = await dispatch(createReplyPostCommentAction(reqData));
        if (response?.error) {
          setLocalError(response.error);
          setOpen(true);
        }
        setNewReply("");
      } else {
        alert("Reply cannot be null!");
      }
    }),
    [newReply, dispatch]
  );

  const handleDeleteComment = useCallback(
    checkAuth(async (commentId) => {
      await dispatch(deletepostCommentAction(commentId));
      await dispatch(fetchPostById(postId));
      setOpen(false);
    }),
    [dispatch]
  );
  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    setLocalError(null);
  }, []);
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Typography variant="h6">Comments</Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Avatar src={user?.avatarUrl || "/placeholder.svg"} alt={user?.fullname} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddComment}>
              Post
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                newReply={newReply}
                checkAuth={checkAuth}
                handleReplyChange={handleReplyChange}
                handleSubmitReply={handleSubmitReply}
                handleDeleteComment={handleDeleteComment}
                user={user}
              />
            ))}
          </Box>
        </Box>
      )}
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        {localError && (
          <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
            {localError}
          </Alert>
        )}
      </Snackbar>
      <AuthDialog />
    </>
  );
};

export default CommentSection;
