import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Avatar, Box, Button, IconButton, Menu, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { editCommentAction, likeCommentAction } from "../../redux/comment/comment.action";
import { createReportAction } from "../../redux/report/report.action";
import LoadingSpinner from "../LoadingSpinner";
import ReportModal from "./ReportModal";
import { Link } from "react-router-dom";
import { formatExactTime, formatRelativeTime } from "../../utils/formatDate";

const CommentItem = ({ comment, user, newReply, checkAuth, handleReplyChange, handleSubmitReply, handleDeleteComment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  
  // Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedCommentUser, setSelectedCommentUser] = useState(null); // 👈 SỬA: Lưu trữ User Object của comment/reply đang được chọn
  const [isReplyMenuSelected, setIsReplyMenuSelected] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [editingReplies, setEditingReplies] = useState({});

  // ❗ SỬA: Thêm userObject vào để kiểm tra quyền sở hữu
  const handleMenuOpen = (event, commentId, userObject, isReply = false) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
    setSelectedCommentUser(userObject); // Lưu user để kiểm tra quyền
    setIsReplyMenuSelected(isReply);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentUser(null); // Reset user
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

  // ❗ SỬA: Chỉ truyền ID. Hàm sẽ tự tìm nội dung gốc của reply.
  const handleEditReply = (replyId) => {
    // Tìm reply tương ứng để lấy nội dung gốc
    const replyToEdit = comment.replyComment.find(r => r.id === replyId);
    
    if (!replyToEdit) return;

    setEditingReplies((prev) => ({
      ...prev,
      [replyId]: replyToEdit.content, // Lấy nội dung GỐC của reply
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
      // Dùng parentCommentId để đảm bảo Redux cập nhật đúng
      await dispatch(editCommentAction(reply.id, { ...reply, content: editedContent, parentCommentId: comment.id }));
      
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
        await dispatch(likeCommentAction(comment.id));
      } catch (e) {
        console.log("Error liking comment: ", e);
      } finally {
        setLoading(false);
      }
    }),
    [dispatch, checkAuth, comment.id]
  );

  const handleLikeReply = useCallback(
    checkAuth(async (replyId) => {
      try {
        setLoading(true);
        await dispatch(likeCommentAction(replyId));
      } catch (e) {
        console.log("Error liking reply comment: ", e);
      } finally {
        setLoading(false);
      }
    }),
    [dispatch, checkAuth]
  );

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
      {loading && <LoadingSpinner />}
      
      <Box sx={{ width: "100%" }}>
        {/* Parent Comment */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "left",
            width: "100%",
          }}
        >
          <Box
            sx={{
              flexDirection: "column",
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: "0%",
              minWidth: 0,
              width: "100%",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <Avatar
                sx={{ mr: 1.5, width: 35, height: 35 }}
                src={comment.user.avatarUrl || "/placeholder.svg"}
                alt="Avatar"
              />
              <Typography 
                component={Link}
                to={`/profile/${comment.user.id}`}
                sx={{ 
                  cursor: "pointer", 
                  lineHeight: 1, 
                  display: "block",
                  mb: 0,
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: '15px',
                  fontWeight: 'bold',
                  "&:hover": {
                      textDecoration: "underline",
                      color: "primary.main",
                  }
                }}
              >
                {comment.user.username || "Anonymous"}
              </Typography>

              <IconButton
                // ❗ SỬA: Truyền comment.user
                onClick={(event) => handleMenuOpen(event, comment.id, comment.user, false)}
              >
                <MoreVertIcon />
              </IconButton>

              {/* ❗ SỬA: Menu Logic Đã được Hợp Nhất */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleOpenReportModal}>Report</MenuItem>
                
                {/* Nút EDIT: Chỉ user sở hữu mới thấy */}
                {user?.id === selectedCommentUser?.id && (
                    <MenuItem 
                        onClick={() => {
                            isReplyMenuSelected 
                                ? handleEditReply(selectedCommentId) // Sửa Reply
                                : handleEdit(); // Sửa Parent
                        }}
                    >
                        Edit
                    </MenuItem>
                )}
                
                {/* Nút DELETE: User sở hữu HOẶC ADMIN mới thấy */}
                {(user?.id === selectedCommentUser?.id || user?.role?.name === "ADMIN") && (
                    <MenuItem
                        onClick={() => {
                            handleDeleteComment(selectedCommentId);
                            handleMenuClose();
                        }}
                    >
                        Delete
                    </MenuItem>
                )}
              </Menu>
            </Box>

            {isEditing ? (
              <Box sx={{ mt: 1, width: "100%" }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  variant="outlined"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  sx={{ backgroundColor: "background.paper" }}
                />
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateComment}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="body1" sx={{ml: 5.8 }}>
                  {comment.content}
                </Typography>
                
                {/* ❗ CẢI TIẾN UX: Tooltip cho Parent Comment */}
                <Tooltip title={formatExactTime(comment?.createdAt)} placement="bottom">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 5.8 }}
                  >
                    {formatRelativeTime(comment?.createdAt)}
                  </Typography>
                </Tooltip>

                <Box
                  sx={{ display: "flex", alignItems: "center", mt: 0.5, gap: 2, ml: 5.8 }}
                >
                  <IconButton onClick={handleLikeComment} disabled={loading}>
                    {comment.likedByCurrentUser ? (
                      <ThumbUpIcon color="primary" />
                    ) : (
                      <ThumbUpOffAltIcon />
                    )}
                  </IconButton>
                  <Typography variant="body2">
                    {comment.likedUsers?.length || 0}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    Reply
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Reply Comments */}
        {comment?.replyComment?.map((reply) => (
          <Box
            key={reply?.id}
            sx={{
              ml: 5,
              borderLeft: "1px solid #ccc",
              pl: 2,
              textAlign: "left",
              width: "100%",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", ml: 2, width: "100%" }}
            >
              <Box sx={{ flex: 1, ml: 1, width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{ mr: 1.5, width: 35, height: 35 }}
                    src={reply.user.avatarUrl || "/placeholder.svg"}
                    alt="Avatar"
                  />
                  <Typography 
                    component={Link}
                    to={`/profile/${reply.user.id}`}
                    sx={{ 
                      cursor: "pointer", 
                      lineHeight: 1, 
                      display: "block",
                      mb: 0,
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: '15px',
                      fontWeight: 'bold',
                      "&:hover": {
                          textDecoration: "underline",
                          color: "primary.main",
                        }
                    }}
                  >
                    {reply.user.username || "Anonymous"}
                  </Typography>
                  
                  {/* ❗ CẢI TIẾN UX: Tooltip cho Reply Comment */}
                  <Tooltip title={formatExactTime(reply?.createdAt)} placement="bottom">
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: 10 }}
                    >
                      {formatRelativeTime(reply?.createdAt)}
                    </Typography>
                  </Tooltip>
                  
                  <IconButton
                    // ❗ SỬA: Truyền reply.user
                    onClick={(event) => handleMenuOpen(event, reply.id, reply.user, true)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  {/* Menu đã được sửa ở trên nên không cần thay đổi ở đây */}
                </Box>
                
                {editingReplies[reply?.id] ? (
                  <Box sx={{width: "100%" }}>
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
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateReply(reply)}
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleCancelEditReply(reply.id)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ml: 6.8}}
                    >
                      {reply?.content}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 1, ml: 6.8 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleLikeReply(reply?.id)}
                        sx={{ gap: 1 }}
                      >
                        {reply?.likedByCurrentUser ? (
                          <ThumbUpIcon fontSize="small" color="primary" />
                        ) : (
                          <ThumbUpOffAltIcon fontSize="small" />
                        )}
                        <Typography variant="body2">
                          {reply?.likedUsers?.length || 0}
                        </Typography>
                      </IconButton>
                      {!isReplying && (
                        <Button
                          size="small"
                          onClick={() => setIsReplying(!isReplying)}
                        >
                          Reply
                        </Button>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

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