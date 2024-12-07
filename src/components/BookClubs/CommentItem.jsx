import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Avatar, Box, Button, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { editCommentAction, likeCommentAction } from "../../redux/comment/comment.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import LoadingSpinner from "../LoadingSpinner";
import { formatDate } from "../../utils/formatDate";
import { createReportAction } from "../../redux/report/report.action";
import ReportModal from "./ReportModal";

const CommentItem = ({ comment, user, newReply, checkAuth, handleReplyChange, handleSubmitReply, handleDeleteComment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
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
  const [isReplyMenuSelected, setIsReplyMenuSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [editingReplies, setEditingReplies] = useState({});

  const handleMenuOpen = (event, commentId, isReply = false) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
    setIsReplyMenuSelected(isReply);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsReplyMenuSelected(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const handleEditReply = (replyId, currentContent) => {
    setEditingReplies((prev) => ({
      ...prev,
      [replyId]: currentContent,
    }));
    handleMenuClose();
  };

  const handleCancelEditReply = (replyId) => {
    setEditingReplies((prev) => {
      const updated = { ...prev };
      delete updated[replyId];
      return updated;
    });
  };

  const handleUpdateReply = async (reply) => {
    const editedContent = editingReplies[reply.id];
    if (!editedContent || !editedContent.trim()) {
      alert("Reply content cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(editCommentAction(reply.id, { ...reply, content: editedContent }));
      setEditingReplies((prev) => {
        const updated = { ...prev };
        delete updated[reply.id];
        return updated;
      });
    } catch (error) {
      console.log("Error updating reply:", error);
      alert("Failed to update reply.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
    handleMenuClose();
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportReason("");
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      alert("Please enter a reason for reporting.");
      return;
    }

    const reportData = {
      reason: reportReason,
      comment: { id: selectedCommentId }, // This will be either parent comment or reply comment
    };

    try {
      console.log("Report data:", reportData);
      await dispatch(createReportAction(reportData));
      alert("Report submitted successfully.");
      handleCloseReportModal();
    } catch (error) {
      alert("Failed to submit report.");
    }
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

  const handleUpdateComment = async () => {
    if (editedContent.trim() === "") {
      alert("Comment content cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      await dispatch(editCommentAction(comment.id, { ...comment, content: editedContent }));
      setIsEditing(false);
    } catch (error) {
      console.log("Error updating comment:", error);
      alert("Failed to update comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box>
          {/* Parent Comment */}
          <Box sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
            <Avatar sx={{ mb: 8 }} src={comment.user.avatarUrl || "/placeholder.svg"} alt="Avatar" />
            <Box sx={{ flex: 1, mx: 2, mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: 15, fontWeight: "bold" }}>{comment.user.username || "Anonymous"}</Typography>

                <IconButton onClick={(event) => handleMenuOpen(event, comment.id, false)}>
                  <MoreVertIcon />
                </IconButton>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleOpenReportModal}>Report</MenuItem>
                  {isReplyMenuSelected
                    ? [
                        user?.id === comment.user.id && (
                          <MenuItem onClick={() => handleEditReply(selectedCommentId, editedContent)}>Edit</MenuItem>
                        ),
                        (user?.id === comment.user.id || user?.role?.name === "ADMIN") && (
                          <MenuItem
                            onClick={() => {
                              handleDeleteComment(selectedCommentId);
                              handleMenuClose();
                            }}
                          >
                            Delete
                          </MenuItem>
                        ),
                      ].filter(Boolean)
                    : [
                        user?.id === comment.user.id && <MenuItem onClick={handleEdit}>Edit</MenuItem>,
                        (user?.id === comment.user.id || user?.role?.name === "ADMIN") && (
                          <MenuItem
                            onClick={() => {
                              handleDeleteComment(selectedCommentId);
                              handleMenuClose();
                            }}
                          >
                            Delete
                          </MenuItem>
                        ),
                      ].filter(Boolean)}
                </Menu>
              </Box>
              {isEditing ? (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    variant="outlined"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateComment} disabled={loading}>
                      {loading ? "Updating..." : "Update"}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancelEdit} disabled={loading}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {comment.content}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 2 }}>
                    <IconButton onClick={handleLikeComment} disabled={loading}>
                      {isLiked ? <ThumbUpIcon color="primary" /> : <ThumbUpOffAltIcon />}
                    </IconButton>
                    <Typography variant="body2">{likes}</Typography>
                    <Button size="small" onClick={() => setIsReplying(!isReplying)}>
                      Reply
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          {/* Reply Comments */}
          {comment?.replyComment?.map((reply) => (
            <Box key={reply?.id} sx={{ ml: 5, mt: 2, borderLeft: "1px solid #ccc", pl: 2, pt: 2, textAlign: "left" }}>
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Avatar src={reply?.user.avatarUrl || "/placeholder.svg"} alt="Avatar" />
                <Box sx={{ flex: 1, ml: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6">{reply?.user?.username || "Anonymous"}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: 10 }}>
                      {formatDate(reply?.createdAt)}
                    </Typography>
                  </Box>
                  {editingReplies[reply?.id] ? (
                    <Box sx={{ mt: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        variant="outlined"
                        value={editingReplies[reply?.id]}
                        onChange={(e) =>
                          setEditingReplies((prev) => ({
                            ...prev,
                            [reply?.id]: e.target.value,
                          }))
                        }
                      />
                      <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                        <Button variant="contained" color="primary" onClick={() => handleUpdateReply(reply)} disabled={loading}>
                          {loading ? "Updating..." : "Update"}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleCancelEditReply(reply.id)} disabled={loading}>
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="body1" sx={{ fontSize: 23 }} color="textPrimary">
                        {reply?.content}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <IconButton size="small" onClick={() => handleLikeReply(reply?.id)} sx={{ gap: 1 }}>
                          {replyLikes[reply?.id]?.isLiked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
                          <Typography variant="body2">{replyLikes[reply?.id]?.likes || 0}</Typography>
                        </IconButton>
                        {!isReplying && (
                          <Button variant="outlined" size="small" onClick={() => setIsReplying(!isReplying)}>
                            Reply
                          </Button>
                        )}
                      </Box>
                    </>
                  )}
                </Box>

                <IconButton onClick={(event) => handleMenuOpen(event, reply.id, true)}>
                  <MoreVertIcon />
                </IconButton>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleOpenReportModal}>Report</MenuItem>
                  {isReplyMenuSelected
                    ? [
                        user?.id === reply?.user.id && <MenuItem onClick={() => handleEditReply(reply.id, reply.content)}>Edit</MenuItem>,
                        (user?.id === reply?.user.id || user?.role?.name === "ADMIN") && (
                          <MenuItem
                            onClick={() => {
                              handleDeleteComment(reply.id);
                              handleMenuClose();
                            }}
                          >
                            Delete
                          </MenuItem>
                        ),
                      ].filter(Boolean)
                    : [
                        user?.id === comment?.user.id && <MenuItem onClick={handleEdit}>Edit</MenuItem>,
                        (user?.id === comment?.user.id || user?.role?.name === "ADMIN") && (
                          <MenuItem
                            onClick={() => {
                              handleDeleteComment(comment.id);
                              handleMenuClose();
                            }}
                          >
                            Delete
                          </MenuItem>
                        ),
                      ].filter(Boolean)}
                </Menu>
              </Box>
            </Box>
          ))}

          {/* Reply Input */}
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
      {isReportModalOpen && (
        <ReportModal
          open={true}
          onClose={handleCloseReportModal}
          reportReason={reportReason}
          setReportReason={setReportReason}
          handleSubmitReport={handleSubmitReport}
        />
      )}
    </>
  );
};

export default CommentItem;
