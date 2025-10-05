import { Alert, Avatar, Box, Button, Divider, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCommentByPostAction,
  createPostCommentAction,
  createReplyPostCommentAction,
  deletePostCommentAction,
} from "../../redux/comment/comment.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
import LoadingSpinner from "../LoadingSpinner";
import CommentItem from "./CommentItem";

const CommentSection = ({ postId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { postComments } = useSelector((state) => state.comment);
  const [commentText, setCommentText] = useState("");
  const [newReply, setNewReply] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { checkAuth, AuthDialog } = useAuthCheck();

  const handleAddComment = checkAuth(async () => {
    if (commentText.trim() === "") {
      setLocalError("Comment cannot be empty");
      setOpen(true);
      return;
    }

    const reqData = {
      postId: postId,
      data: {
        content: commentText,
      },
    };

    try {
      const result = await dispatch(createPostCommentAction(reqData));
      if (result?.error) {
        setLocalError(result.error);
        setOpen(true);
      } else {
        setCommentText("");
      }
    } catch (error) {
      console.log("Error creating comment:", error);
      setLocalError(error.message || "Failed to post comment");
      setOpen(true);
    }
  });

  const handleReplyChange = useCallback((event) => {
    setNewReply(event.target.value);
  }, []);

  const handleSubmitReply = useCallback(
    checkAuth(async (parentCommentId) => {
      if (newReply.trim()) {
        const reqData = {
          postId: postId,
          parentCommentId: parentCommentId,
          data: {
            content: newReply,
          },
        };
        const response = await dispatch(createReplyPostCommentAction(reqData));
        if (response?.error) {
          setLocalError(response.error);
          setOpen(true);
        } else {
          setNewReply("");
        }
      } else {
        setLocalError("Reply cannot be empty");
        setOpen(true);
      }
    }),
    [newReply, dispatch, postId]
  );

  const handleDeleteComment = useCallback(
    checkAuth(async (commentId) => {
      const result = await dispatch(deletePostCommentAction(commentId));
      if (result?.error) {
        setLocalError(result.error);
        setOpen(true);
      }
    }),
    [dispatch]
  );

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    setLocalError(null);
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        await dispatch(getAllCommentByPostAction(user ? true : false, postId));
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId, dispatch, user]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Comments
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Avatar src={user?.avatarUrl || "/placeholder.svg"} alt={user?.username || "User"} sx={{ width: 40, height: 40 }} />
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  size="small"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Post
                </Button>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mt: 2 }}>
            {postComments && postComments.length > 0 ? (
              postComments.map((comment) => (
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
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                No comments yet. Be the first to share your thoughts!
              </Typography>
            )}
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
