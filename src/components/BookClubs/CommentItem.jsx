import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Avatar, Box, Button, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { likeCommentAction } from "../../redux/comment/comment.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import LoadingSpinner from "../LoadingSpinner";
import { formatDate } from "../../utils/formatDate";

const CommentItem = ({ comment, user, newReply, checkAuth, handleReplyChange, handleSubmitReply, handleDeleteComment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [likes, setLikes] = useState(comment.likedUsers.length || 0);
  const [isLiked, setIsLiked] = useState(user ? isFavouredByReqUser(user, comment) : false);
  const [replyLikes, setReplyLikes] = useState(
    comment.replyComment.reduce((acc, reply) => {
      acc[reply?.id] = { likes: reply?.likedUsers.length || 0, isLiked: user ? isFavouredByReqUser(user, reply) : false };
      return acc;
    }, {})
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLikeComment = useCallback(
    checkAuth(async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          dispatch(likeCommentAction(comment.id));
          setIsLiked((prev) => !prev);
          setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
        }, 300);
      } catch (e) {
        console.log("Error liking comment: ", e);
      } finally {
        setLoading(false);
      }
    }),
    [dispatch, checkAuth, comment.id, isLiked]
  );

  // Handle like for reply comments
  const handleLikeReply = checkAuth(async (replyId) => {
    try {
      setLoading(true);
      setTimeout(() => {
        dispatch(likeCommentAction(replyId));
        setReplyLikes((prevLikes) => ({
          ...prevLikes,
          [replyId]: {
            isLiked: !prevLikes[replyId].isLiked,
            likes: prevLikes[replyId].isLiked ? prevLikes[replyId].likes - 1 : prevLikes[replyId].likes + 1,
          },
        }));
      }, 300);
    } catch (e) {
      console.log("Error liking reply comment: ", e);
    } finally {
      setLoading(false);
    }
  });
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
            <Avatar sx={{ mb: 8 }} src={comment.user.avatarUrl || "/placeholder.svg"} alt="Avatar" />
            <Box sx={{ flex: 1, mx: 2, mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: 15, fontWeight: "bold" }}>{comment.user.username || "Anonymous"}</Typography>

                {(user?.id === comment.user.id || user?.role?.name === "ADMIN") && (
                  <>
                    <IconButton onClick={(event) => handleMenuOpen(event, comment.id)}>
                      <MoreVertIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                      <MenuItem onClick={() => handleDeleteComment(selectedCommentId)}>Delete</MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
              <Typography variant="body1" sx={{ fontSize: 20 }} color="textPrimary">
                {comment.content}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: 10 }}>
                {formatDate(comment.createdAt)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <IconButton size="small" onClick={handleLikeComment} sx={{ gap: 1 }}>
                  {isLiked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
                  <Typography variant="body2">{likes}</Typography>
                </IconButton>

                {!isReplying && (
                  <Button variant="outlined" size="small" onClick={handleReply}>
                    Reply
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          {comment?.replyComment?.map((reply) => (
            <Box key={reply?.id} sx={{ ml: 5, mt: 2, borderLeft: "1px solid #ccc", pl: 2, pt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Avatar src={comment.user.avatarUrl || "/placeholder.svg"} alt="Avatar" />
                <Box sx={{ flex: 1, ml: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6">{reply?.user?.username || "Anonymous"}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: 10 }}>
                      {formatDate(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontSize: 23 }} color="textPrimary">
                    {reply?.content}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <IconButton size="small" onClick={() => handleLikeReply(reply?.id)} sx={{ gap: 1 }}>
                      {replyLikes[reply?.id]?.isLiked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
                      <Typography variant="body2">{replyLikes[reply?.id]?.likes || 0}</Typography>
                    </IconButton>
                    {!isReplying && (
                      <Button variant="outlined" size="small" onClick={handleReply}>
                        Reply
                      </Button>
                    )}
                  </Box>
                </Box>

                {(user?.id === reply?.user.id || user?.role?.name === "ADMIN") && (
                  <>
                    <IconButton onClick={(event) => handleMenuOpen(event, reply.id)}>
                      <MoreVertIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                      <MenuItem onClick={() => handleDeleteComment(selectedCommentId)}>Delete</MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            </Box>
          ))}

          {isReplying && (
            <Box sx={{ ml: 5, mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Write your reply..."
                value={newReply}
                onChange={handleReplyChange}
                multiline
                rows={4}
                variant="outlined"
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, ml: 1 }}>
                <Button variant="outlined" size="small" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
                <Button size="small" onClick={() => handleSubmitReply(comment.id)}>
                  Submit Reply
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default CommentItem;
