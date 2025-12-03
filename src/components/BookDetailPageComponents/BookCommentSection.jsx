import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Snackbar,
  TextField,
  Typography,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  createBookCommentAction,
  createReplyBookCommentAction,
  deleteCommentAction,
  getAllCommentByBookAction,
} from "../../redux/comment/comment.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
import CommentItem from "../BookClubs/CommentItem";

const BookCommentSection = ({ bookId, user }) => {
  // Optimize selector to avoid re-renders on unrelated state changes
  const { bookComments, pagination } = useSelector(
    (store) => ({
      bookComments: store.comment.bookComments,
      pagination: store.comment.pagination,
    }),
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [open, setOpen] = useState(false);
  const [localError, setLocalError] = useState(null);
  const dispatch = useDispatch();
  const { checkAuth, AuthDialog } = useAuthCheck();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  

  const fetchComments = useCallback(
    async (page = 0, size = 10) => {
      try {
        page === 0 ? setLoading(true) : setLoadingMore(true);

        const response = await dispatch(getAllCommentByBookAction(user ? true : false, bookId, page, size));

        if (response && response.error) {
          setLocalError("Failed to load comments: " + response.error);
          setOpen(true);
        }
      } catch (e) {
        console.error("Error fetching comments: ", e);
        setLocalError("Failed to load comments. Please try again later.");
        setOpen(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [bookId, dispatch, user]
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

        const reqData = {
          bookId: bookId,
          data: { content: newComment },
        };

        const response = await dispatch(createBookCommentAction(reqData));

        if (response?.error) {
          setLocalError(response.error);
          setOpen(true);
        } else {
          setNewComment("");
        }
      } catch (e) {
        console.log("Error comment: ", e);
        setLocalError("Failed to post comment. Please try again.");
        setOpen(true);
      }
    }),
    [newComment, bookId, dispatch, checkAuth]
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
        } else {
          setNewReply("");
        }
      } catch (e) {
        console.log("Error replying: ", e);
        setLocalError("Failed to post reply. Please try again.");
        setOpen(true);
      }
    }),
    [newReply, bookId, dispatch, checkAuth]
  );

  const handleDeleteComment = useCallback(
    checkAuth(async (commentId) => {
      try {
        await dispatch(deleteCommentAction(commentId));
      } catch (e) {
        console.log("Error deleting comment: ", e);
        setLocalError("Failed to delete comment. Please try again.");
        setOpen(true);
      }
    }),
    [dispatch, checkAuth]
  );

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    setLocalError(null);
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 1 : 2 }}>
        <CommentIcon sx={{ mr: 1.5 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Discussion
        </Typography>
      </Box>

      <Divider sx={{ mb: isMobile ? 2 : 3 }} />

      {/* Comment Input Section */}
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          mb: isMobile ? 2 : 4,
          gap: 2,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateComment();
        }}
      >
        {user && (
          <Avatar src={user.avatarUrl} alt={user.username} sx={{ width: 40, height: 40 }}>
            {user.username?.charAt(0)}
          </Avatar>
        )}

        <TextField
          fullWidth
          variant="outlined"
          placeholder={user ? "Share your thoughts..." : "Sign in to comment"}
          size="medium"
          required
          value={newComment}
          onChange={handleCommentChange}
          disabled={!user}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "background.paper",
              "&:hover": {
                  backgroundColor: "action.hover",
              },
            },
          }}
        />

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleCreateComment}
          disabled={!newComment.trim() || !user}
          sx={{
            borderRadius: 1,
            py: 1.2,
            px: 2.5,
          }}
        >
          Post
        </Button>
      </Box>

      {/* Comment List Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4, flexDirection: "column", alignItems: "center" }}>
          <CircularProgress size={30} thickness={4} />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Loading comments...
          </Typography>
        </Box>
      ) : bookComments?.length > 0 ? (
        <>
          <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 2 }}>
            {bookComments.map((comment, index) => (
              <React.Fragment key={comment.id || `temp-${index}`}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    flexDirection: "column",
                    p: isMobile ? 1 : 2,
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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={20} /> : null}
                sx={{ borderRadius: 1, py: 1 }}
              >
                {loadingMore ? "Loading..." : "Load More Comments"}
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <CommentIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography color="text.secondary" variant="h6" sx={{ mb: 1 }}>
            No comments yet
          </Typography>
          <Typography color="text.secondary" variant="body2">
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
    </Box>
  );
};

export default memo(BookCommentSection);
