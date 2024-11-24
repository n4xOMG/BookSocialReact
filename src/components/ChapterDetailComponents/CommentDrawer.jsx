import React, { useCallback, useEffect, useState } from "react";
import { useAuthCheck } from "../../utils/useAuthCheck";
import {
  createChapterCommentAction,
  createReplyChapterCommentAction,
  deleteCommentAction,
  getAllCommentByChapterAction,
} from "../../redux/comment/comment.action";
import { Alert, Box, Button, CircularProgress, Drawer, List, ListItem, Snackbar, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CommentItem from "../BookClubs/CommentItem";
export default function CommentDrawer({ open, user, bookId, chapterId, onToggleDrawer }) {
  const { chapterComments, error } = useSelector((store) => store.comment);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [snackbarOpen, setSnackBarOpen] = useState(false);
  const dispatch = useDispatch();
  const { checkAuth, AuthDialog } = useAuthCheck();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(getAllCommentByChapterAction(bookId, chapterId));
    } catch (e) {
      console.error("Error fetching comments: ", e);
      setSnackBarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [bookId, chapterId, dispatch]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentChange = useCallback((event) => {
    setNewComment(event.target.value);
  }, []);

  const handleReplyChange = useCallback((event) => {
    setNewReply(event.target.value);
  }, []);

  const handleCreateComment = useCallback(
    checkAuth(async () => {
      if (newComment.trim()) {
        const reqData = {
          bookId: bookId,
          chapterId: chapterId,
          data: {
            content: newComment,
          },
        };
        await dispatch(createChapterCommentAction(reqData));
        fetchComments();
        setNewComment("");
      } else {
        alert("Comment cannot be null!");
      }
    }),
    [newComment, bookId, dispatch, fetchComments]
  );

  const handleSubmitReply = useCallback(
    checkAuth(async (parentCommentId) => {
      if (newReply.trim()) {
        const reqData = {
          parentCommentId: parentCommentId,
          bookId: bookId,
          chapterId: chapterId,
          data: {
            content: newReply,
          },
        };
        await dispatch(createReplyChapterCommentAction(reqData));
        fetchComments();
        setNewReply("");
      } else {
        alert("Reply cannot be null!");
      }
    }),
    [newReply, bookId, dispatch, fetchComments]
  );

  const handleDeleteComment = useCallback(
    checkAuth(async (commentId) => {
      await dispatch(deleteCommentAction(commentId));
      fetchComments();
    }),
    [dispatch, fetchComments]
  );

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setSnackBarOpen(false);
  }, []);
  return (
    <Drawer anchor="right" open={open} onClose={onToggleDrawer} borderRadius={2} sx={{ zIndex: 1300 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            bgcolor: "#f4f4f5",
            width: { xs: "80vw", md: "50vw" },
            px: 2,
            py: 2,
            zIndex: 1300,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Comments
          </Typography>
          <List>
            {chapterComments?.map((comment, index) => (
              <ListItem key={index} alignItems="flex-start">
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
            ))}
          </List>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your comment..."
              required
              value={newComment}
              onChange={handleCommentChange}
              sx={{ bgcolor: "white", borderRadius: 1 }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleCreateComment();
                }
              }}
            />
            <Button variant="contained" color="primary" onClick={handleCreateComment} sx={{ ml: 2 }}>
              Submit
            </Button>
            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleClose}>
              {error && (
                <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
                  {error}
                </Alert>
              )}
            </Snackbar>
          </Box>
        </Box>
      )}
      <AuthDialog />
    </Drawer>
  );
}
