import React, { useCallback, useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Avatar, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CommentItem from "./CommentItem";
import {
  createPostCommentAction,
  createReplyPostCommentAction,
  deleteCommentAction,
  editCommentAction,
  getAllCommentByPostAction,
} from "../../redux/comment/comment.action";
import LoadingSpinner from "../LoadingSpinner";
import { useAuthCheck } from "../../utils/useAuthCheck";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const { postComments } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState("");
  const [newReply, setNewReply] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { checkAuth, AuthDialog } = useAuthCheck();
  const fetchPostComments = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(getAllCommentByPostAction(postId));
    } catch (e) {
      console.log("Error fetching comments:", e);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchPostComments();
  }, [dispatch, postId, fetchPostComments]);

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
      await dispatch(deleteCommentAction(commentId));
      fetchPostComments();
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
            {postComments.map((comment) => (
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
