import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBookCommentAction,
  createReplyBookCommentAction,
  deleteCommentAction,
  getAllCommentByBookAction,
} from "../../redux/comment/comment.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
import CommentItem from "../BookClubs/CommentItem";

const BookCommentSection = ({ bookId, user }) => {
  const { bookComments, pagination } = useSelector((store) => store.comment);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [open, setOpen] = useState(false);
  const [localError, setLocalError] = useState(null);
  const dispatch = useDispatch();
  const { checkAuth, AuthDialog } = useAuthCheck();

  const fetchComments = useCallback(
    async (page = 0, size = 10) => {
      try {
        page === 0 ? setLoading(true) : setLoadingMore(true);
        await dispatch(getAllCommentByBookAction(bookId, page, size));
      } catch (e) {
        console.error("Error fetching comments: ", e);
        setLocalError("Failed to load comments. Please try again later.");
        setOpen(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [bookId, dispatch]
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore) {
      fetchComments(pagination.page + 1, pagination.size);
    }
  }, [fetchComments, pagination]);

  const handleCommentChange = useCallback((event) => {
    setNewComment(event.target.value);
  }, []);

  const handleReplyChange = useCallback((event) => {
    setNewReply(event.target.value);
  }, []);

  const handleCreateComment = useCallback(
    checkAuth(async () => {
      try {
        if (!newComment.trim()) {
          setLocalError("Comment cannot be empty!");
          setOpen(true);
          return;
        }

        // Optimistic update
        const optimisticComment = {
          id: `temp-${Date.now()}`,
          content: newComment,
          createdAt: new Date().toISOString(),
          user: user,
          replyComment: [],
          likes: 0,
          isOptimistic: true, // Flag to identify optimistic update
        };

        dispatch({
          type: "CREATE_BOOK_COMMENT_SUCCESS",
          payload: optimisticComment,
        });
        setNewComment("");

        // Actual API call
        const reqData = {
          bookId: bookId,
          data: { content: newComment },
        };

        const response = await dispatch(createBookCommentAction(reqData));

        if (response?.error) {
          // Remove optimistic comment if there was an error
          dispatch({
            type: "DELETE_COMMENT_SUCCESS",
            payload: optimisticComment.id,
          });
          setLocalError(response.error);
          setOpen(true);
        }

        // Refresh comments after a successful post
        fetchComments();
      } catch (e) {
        console.log("Error comment: ", e);
        setLocalError("Failed to post comment. Please try again.");
        setOpen(true);
      }
    }),
    [newComment, bookId, dispatch, fetchComments, user]
  );

  const handleSubmitReply = useCallback(
    checkAuth(async (parentCommentId) => {
      if (!newReply.trim()) {
        setLocalError("Reply cannot be empty!");
        setOpen(true);
        return;
      }

      try {
        const reqData = {
          parentCommentId: parentCommentId,
          bookId: bookId,
          data: {
            content: newReply,
          },
        };

        const response = await dispatch(createReplyBookCommentAction(reqData));

        if (response?.error) {
          setLocalError(response.error);
          setOpen(true);
        }

        fetchComments();
        setNewReply("");
      } catch (e) {
        console.log("Error replying: ", e);
        setLocalError("Failed to post reply. Please try again.");
        setOpen(true);
      }
    }),
    [newReply, bookId, dispatch, fetchComments]
  );

  const handleDeleteComment = useCallback(
    checkAuth(async (commentId) => {
      try {
        // Optimistic delete
        dispatch({
          type: "DELETE_COMMENT_SUCCESS",
          payload: commentId,
        });

        await dispatch(deleteCommentAction(commentId));
      } catch (e) {
        console.log("Error deleting comment: ", e);
        setLocalError("Failed to delete comment. Please try again.");
        setOpen(true);
        // Refresh to get actual state after error
        fetchComments();
      }
    }),
    [dispatch, fetchComments]
  );

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    setLocalError(null);
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, color: "#333" }}>
        Discussion
      </Typography>

      {/* Comment Input Section */}
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          p: 1,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateComment();
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Share your thoughts..."
          size="medium"
          required
          value={newComment}
          onChange={handleCommentChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <IconButton color="primary" onClick={handleCreateComment} sx={{ ml: 1 }} disabled={!newComment.trim()}>
          <SendIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Comment List Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : bookComments?.length > 0 ? (
        <>
          <List sx={{ width: "100%" }}>
            {bookComments.map((comment, index) => (
              <React.Fragment key={comment.id || `temp-${index}`}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    flexDirection: "column",
                    p: 2,
                    opacity: comment.isOptimistic ? 0.7 : 1,
                  }}
                >
                  <CommentItem
                    comment={comment}
                    newReply={newReply}
                    checkAuth={checkAuth}
                    handleReplyChange={handleReplyChange}
                    handleSubmitReply={handleSubmitReply}
                    handleDeleteComment={handleDeleteComment}
                    user={user}
                  />
                </ListItem>
                {index < bookComments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>

          {pagination.hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={20} /> : null}
              >
                {loadingMore ? "Loading..." : "Load More Comments"}
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary" variant="body1">
            Be the first to share your thoughts on this book!
          </Typography>
        </Box>
      )}

      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
          {localError}
        </Alert>
      </Snackbar>

      <AuthDialog />
    </Paper>
  );
};

export default memo(BookCommentSection);
