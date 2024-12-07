import { Delete, Favorite, Message, Share as ShareIcon } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, CardHeader, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CommentSection from "../../components/BookClubs/CommentSection";
import ShareModal from "../../components/BookClubs/ShareModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { addPost, deletePost, fetchPostById, likePost } from "../../redux/post/post.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import ViewImageModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/ViewImageModal";

const PostDetail = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { post } = useSelector((state) => state.post);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(user && post ? isFavouredByReqUser(user, post) : false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const getPostById = async () => {
    setLoading(true);
    try {
      await dispatch(fetchPostById(postId));
    } catch (e) {
      console.log("Error fetching post by id: ", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPostById();
  }, [dispatch, postId]);

  useEffect(() => {
    if (post && user) {
      setIsLiked(isFavouredByReqUser(user, post));
    }
  }, [user, post]);

  const handleLike = async () => {
    try {
      dispatch(likePost(post.id));
      setIsLiked((prev) => !prev);
    } catch (e) {
      console.log("Error liking post:", e);
      setIsLiked((prev) => !prev);
    }
  };

  const handleDelete = () => {
    dispatch(deletePost(post.id));
    navigate("/"); // Redirect to home after deletion
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
    <>
      {loading || !post ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 2, textAlign: "left" }}>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              avatar={<Avatar src={post?.user.avatarUrl || "/placeholder.svg"} alt={post?.user.fullname} />}
              title={<Typography variant="h6">{post?.user.fullname}</Typography>}
              subheader={post?.timestamp ? new Date(post?.timestamp).toLocaleString() : ""}
              action={
                user &&
                user.id === post?.user.id && (
                  <>
                    <IconButton onClick={handleDelete}>
                      <Delete />
                    </IconButton>
                  </>
                )
              }
            />
            {/* Original post content */}
            {post?.content && (
              <Typography variant="body1" gutterBottom>
                {post?.content}
              </Typography>
            )}
            <CardContent>
              {/* Display shared post information */}
              {post?.sharedPostId && post?.sharedPostUser && (
                <Box sx={{ mb: 2, borderLeft: "4px solid #1976d2", pl: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {post?.sharedPostUser.fullname} shared this post...
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {post?.sharedPostContent}
                  </Typography>
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
                <Typography variant="body2">{post?.likes}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Comments">
                  <IconButton>
                    <Message />
                  </IconButton>
                </Tooltip>
                <Typography variant="body2">{post?.comments.length || 0}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Share">
                  <IconButton onClick={handleShareClick}>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy Link">
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
                      handleCopyLink();
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                {copySuccess && (
                  <Typography variant="caption" color="success.main">
                    {copySuccess}
                  </Typography>
                )}
              </Box>
            </Box>
            <CommentSection comments={post?.comments} postId={post?.id} />

            {/* Share Modal */}
            <ShareModal
              openShareModal={openShareModal}
              setOpenShareModal={setOpenShareModal}
              shareContent={shareContent}
              setShareContent={setShareContent}
              handleShare={handleShare}
              sharedPostId={post?.id}
            />
          </Card>
          {post.images.length > 0 && (
            <ViewImageModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              image={post.images[currentImageIndex]}
              onNext={handleNextImage}
              onPrev={handlePrevImage}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default PostDetail;
