import { Delete, Edit, Favorite, FavoriteBorder, Link as LinkIcon, Message, Share as ShareIcon } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, CardHeader, Chip, Divider, Grid, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, likePost } from "../../redux/post/post.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";
import ViewImageModal from "../AdminPage/Dashboard/BooksTab/ChapterModal/ViewImageModal";
import { formatDistanceToNow } from "date-fns";

const PostItem = ({ post, checkAuth }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(user ? isFavouredByReqUser(user, post) : false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const handleLike = useCallback(
    checkAuth(async () => {
      try {
        setTimeout(() => {
          dispatch(likePost(post.id));
          setIsLiked((prev) => !prev);
        }, 300);
      } catch (e) {
        setIsLiked((prev) => !prev);
        console.log("Error liking post: ", e);
      }
    }),
    [dispatch, isLiked, post.id, checkAuth]
  );

  const handleDelete = () => {
    dispatch(deletePost(post.id));
  };

  const handleShareClick = () => {
    setOpenShareModal(true);
  };

  const handleShare = () => {
    const sharePostData = {
      sharedPostId: post.id,
      content: shareContent,
    };
    dispatch(addPost(sharePostData));
    setOpenShareModal(false);
    setShareContent("");
  };

  const handleCopyLink = () => {
    setCopySuccess("Link copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === post.images.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? post.images.length - 1 : prevIndex - 1));
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Card
      sx={{
        mb: 3,
        textAlign: "left",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflow: "hidden",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardHeader
        avatar={<Avatar src={post.user.avatarUrl || "/placeholder.svg"} alt={post.user.fullname} sx={{ width: 48, height: 48 }} />}
        title={
          <Typography variant="subtitle1" fontWeight="600">
            {post.user.fullname}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatTimestamp(post.timestamp)}
          </Typography>
        }
        action={
          user &&
          user.id === post.user.id && (
            <>
              <IconButton onClick={handleDelete} size="small">
                <Delete fontSize="small" />
              </IconButton>
            </>
          )
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {/* Original post content */}
        {post.content && (
          <Typography variant="body1" gutterBottom sx={{ mb: 2, whiteSpace: "pre-line" }}>
            {post.content}
          </Typography>
        )}

        {/* Display shared post information */}
        {post.sharePostImages && post.sharePostImages.length > 0 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={1}>
              {post.sharePostImages.slice(0, 3).map((imageUrl, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 200,
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      alt={`Shared Post Image ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                      onClick={() => handleImageClick(index)}
                    />
                    {/* Overlay for additional images in shared post */}
                    {index === 2 && post.sharePostImages.length > 3 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          borderRadius: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(index)}
                      >
                        +{post.sharePostImages.length - 3} more
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {post.images && post.images.length > 0 && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Grid container spacing={1}>
              {post.images.slice(0, 3).map((imageUrl, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 200,
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      alt={`Post Image ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                      onClick={() => handleImageClick(index)}
                    />
                    {/* Overlay for additional images */}
                    {index === 2 && post.images.length > 3 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          borderRadius: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(index)}
                      >
                        +{post.images.length - 3} more
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>

      <Divider />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={isLiked ? "Unlike" : "Like"}>
            <IconButton onClick={handleLike} size="small" color={isLiked ? "error" : "default"}>
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          <Chip
            label={post.likes || 0}
            size="small"
            variant="outlined"
            sx={{
              height: 24,
              borderColor: isLiked ? theme.palette.error.main : "transparent",
              color: isLiked ? theme.palette.error.main : "inherit",
              ml: 0.5,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Comments">
            <IconButton onClick={toggleComments} size="small">
              <Message />
            </IconButton>
          </Tooltip>
          <Chip label={post.comments?.length || 0} size="small" variant="outlined" sx={{ height: 24, ml: 0.5 }} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Share">
            <IconButton onClick={handleShareClick} size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Copy Link">
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
                handleCopyLink();
              }}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
          {copySuccess && (
            <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
              {copySuccess}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Comments Section - only show when clicked */}
      {showComments && <CommentSection comments={post.comments} postId={post.id} />}

      {/* Share Modal */}
      <ShareModal
        openShareModal={openShareModal}
        setOpenShareModal={setOpenShareModal}
        shareContent={shareContent}
        setShareContent={setShareContent}
        handleShare={handleShare}
        sharedPostId={post.id}
      />

      {/* View Image Modal */}
      {post.images.length > 0 && (
        <ViewImageModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          image={post.images[currentImageIndex]}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}

      {/* View Image Modal for Shared Post Images */}
      {post.sharePostImages && post.sharePostImages.length > 0 && (
        <ViewImageModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          image={post.sharePostImages[currentImageIndex] || post.images[currentImageIndex]}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </Card>
  );
};

export default PostItem;
