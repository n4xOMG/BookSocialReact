import { Delete, Edit, Favorite, Link as LinkIcon, Message, Share as ShareIcon } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, CardHeader, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, likePost } from "../../redux/post/post.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";
import ViewImageModal from "../AdminPage/Dashboard/BooksTab/ChapterModal/ViewImageModal";

const PostItem = ({ post, onEdit, checkAuth }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(user ? isFavouredByReqUser(user, post) : false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleEdit = () => {
    onEdit(post);
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

  return (
    <Card sx={{ mb: 3, textAlign: "left" }}>
      <CardHeader
        avatar={<Avatar src={post.user.avatarUrl || "/placeholder.svg"} alt={post.user.fullname} />}
        title={<Typography variant="h6">{post.user.fullname}</Typography>}
        subheader={post.timestamp ? new Date(post.timestamp).toLocaleString() : ""}
        action={
          user &&
          user.id === post.user.id && (
            <>
              <IconButton onClick={handleEdit}>
                <Edit />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <Delete />
              </IconButton>
            </>
          )
        }
      />
      <CardContent>
        {/* Original post content */}
        {post.content && (
          <Typography variant="body1" gutterBottom>
            {post.content}
          </Typography>
        )}
        {/* Display shared post information */}
        {post.sharedPostImages && post.sharedPostImages.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              {post.sharedPostImages.slice(0, 3).map((imageUrl, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      position: "relative", // Parent Box set to relative for overlay positioning
                      width: "100%",
                      height: "150px",
                      overflow: "hidden", // Prevent overflow
                      borderRadius: 1,
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
                      }}
                      onClick={() => handleImageClick(index)}
                    />
                    {/* Overlay for additional images in shared post */}
                    {index === 2 && post.sharedPostImages.length > 3 && (
                      <Box
                        sx={{
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          borderRadius: 1,
                          zIndex: 1, // Ensure the overlay is above the image
                        }}
                        onClick={() => handleImageClick(index)}
                      >
                        +{post.sharedPostImages.length - 3} more
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {post.images && post.images.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              {post.images.slice(0, 3).map((imageUrl, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={`Post Image ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: 1,
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => handleImageClick(index)}
                  />
                  {/* Overlay for additional images */}
                  {index === 2 && post.images.length > 3 && (
                    <Box
                      sx={{
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        fontSize: "1.2rem",
                        borderRadius: 1,
                      }}
                      onClick={() => handleImageClick(index)}
                    >
                      +{post.images.length - 3} more
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={isLiked ? "Unlike" : "Like"}>
            <IconButton onClick={handleLike}>
              <Favorite color={isLiked ? "error" : "inherit"} />
            </IconButton>
          </Tooltip>
          <Typography variant="body2">{post.likes}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Comments">
            <IconButton>
              <Message />
            </IconButton>
          </Tooltip>
          <Typography variant="body2">{post.comments.length || 0}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Share">
            <IconButton onClick={handleShareClick}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          {/* Copy Link Button */}
          <Tooltip title="Copy Link">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
                handleCopyLink();
              }}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
          {copySuccess && (
            <Typography variant="caption" color="success.main">
              {copySuccess}
            </Typography>
          )}
        </Box>
      </Box>
      <CommentSection comments={post.comments} postId={post.id} />

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
      {post.sharedPostImages && post.sharedPostImages.length > 0 && (
        <ViewImageModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          image={post.sharedPostImages[currentImageIndex] || post.images[currentImageIndex]}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </Card>
  );
};

export default PostItem;
