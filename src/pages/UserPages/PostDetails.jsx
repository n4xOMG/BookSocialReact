import { Delete, Edit, Favorite, FavoriteBorder, Link as LinkIcon, Message, Share as ShareIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ViewImageModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/ViewImageModal";
import CommentSection from "../../components/BookClubs/CommentSection";
import ShareModal from "../../components/BookClubs/ShareModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { addPost, deletePost, fetchPostById, likePost, updatePost } from "../../redux/post/post.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
import { UploadToServer } from "../../utils/uploadToServer";

const PostDetail = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { post, loading, error } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const { checkAuth, AuthDialog } = useAuthCheck();

  // State management
  const [isLiked, setIsLiked] = useState(post ? post.likedByCurrentUser : false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageSource, setImageSource] = useState("post");
  const [isEditing, setIsEditing] = useState(location.state?.editMode || false);
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState([]);

  // Initialize data
  useEffect(() => {
    dispatch(fetchPostById(user ? true : false, postId));
  }, [dispatch, postId]);

  useEffect(() => {
    if (post) {
      setIsLiked(post.likedByCurrentUser);
      setEditContent(post.content || "");
      setEditImages(post.images || []);
    }
  }, [post]);

  // Image handling functions
  const handleImageClick = (index, source = "post") => {
    setImageSource(source);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const getImages = () => (imageSource === "shared" ? post.sharedPostImages : post.images);

  const renderImages = (images, source = "post") => {
    if (!images || images.length === 0) return null;

    const count = images.length;

    return (
      <Grid container spacing={1} sx={{ mt: 2, mb: 1 }}>
        {images.slice(0, 4).map((url, index) => (
          <Grid
            key={index}
            item
            xs={count === 1 ? 12 : count === 2 ? 6 : count === 3 && index === 0 ? 12 : 6}
            sx={{
              position: "relative",
              height: count === 1 ? "auto" : count === 2 ? 400 : count === 3 && index === 0 ? 250 : 200,
            }}
          >
            <Box
              component="img"
              src={url}
              onClick={() => handleImageClick(index, source)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 2,
                cursor: "pointer",
              }}
            />
            {index === 3 && count > 4 && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(index, source)}
              >
                +{count - 4} more
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    );
  };

  // Utility functions
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Action handlers
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
    [dispatch, post, checkAuth]
  );

  const handleDelete = checkAuth(() => {
    dispatch(deletePost(post.id));
    navigate("/book-clubs");
  });

  const handleSaveEdit = async () => {
    const newFiles = editImages.filter((img) => img instanceof File);
    const existingUrls = editImages.filter((img) => typeof img === "string");

    try {
      const uploadedUrls = await Promise.all(newFiles.map((file) => UploadToServer(file, user.username, "bookposts")));

      const postData = {
        content: editContent,
        images: [...existingUrls, ...uploadedUrls],
      };

      const result = await dispatch(updatePost(post.id, postData));

      if (!result.error) {
        setIsEditing(false);
        await dispatch(fetchPostById(post.id));
      } else {
        console.error("Update failed:", result.error);
      }
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  const handleShare = checkAuth(() => {
    const sharePostData = {
      sharedPostId: post.id,
      content: shareContent,
    };
    dispatch(addPost(sharePostData));
    setOpenShareModal(false);
    setShareContent("");
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    setCopySuccess("Link copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === getImages().length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? getImages().length - 1 : prev - 1));
  };

  // Render loading and error states
  if (loading || !post) return <LoadingSpinner />;
  if (error) return <Typography color="error">Error loading post: {error}</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Card
        sx={{
          mb: 3,
          textAlign: "left",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <CardHeader
          avatar={<Avatar src={post.user.avatarUrl || "/placeholder.svg"} alt={post.user.username} sx={{ width: 48, height: 48 }} />}
          title={
            <Typography
              component={Link}
              to={`/profile/${post.user.id}`}
              variant="subtitle1"
              fontWeight="600"
              sx={{
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline", color: "primary.main" },
              }}
            >
              {post.user.username}
            </Typography>
          }
          subheader={
            <Typography variant="caption" color="text.secondary">
              {formatTimestamp(post.timestamp)}
            </Typography>
          }
          action={
            user?.id === post.user.id && (
              <>
                <IconButton onClick={() => setIsEditing(true)} size="small">
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={handleDelete} size="small">
                  <Delete fontSize="small" />
                </IconButton>
              </>
            )
          }
        />

        <CardContent sx={{ pt: 0 }}>
          {isEditing ? (
            <Box>
              <TextField
                multiline
                fullWidth
                minRows={1}
                maxRows={6}
                variant="outlined"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Image preview for editing */}
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {editImages.map((img, index) => (
                  <Box key={index} sx={{ position: "relative", width: 100, height: 100 }}>
                    <img
                      src={typeof img === "string" ? img : URL.createObjectURL(img)}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => setEditImages((prev) => prev.filter((_, i) => i !== index))}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        width: 24,
                        height: 24,
                      }}
                    >
                      &#10005;
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <>
              {/* Post content */}
              {post.content && (
                <Typography
                  gutterBottom
                  sx={{
                    mb: 2,
                    whiteSpace: "pre-line",
                    fontSize: post.content.length < 50 && !post.images?.length && !post.sharedPostImages?.length ? "1.5rem" : "1rem",
                    fontWeight: post.content.length < 50 && !post.images?.length && !post.sharedPostImages?.length ? "bold" : "normal",
                  }}
                >
                  {post.content}
                </Typography>
              )}

              {/* Shared post display */}
              {post.sharedPostId && (
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: theme.palette.divider,
                    mb: 2,
                    boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        src={post.sharedPostUser?.avatarUrl || "/placeholder.svg"}
                        alt={post.sharedPostUser?.username || "User"}
                        sx={{ width: 30, height: 30 }}
                      />
                    }
                    title={
                      <Typography
                        component={Link}
                        to={`/profile/${post.sharedPostUser.id}`}
                        variant="subtitle2"
                        fontWeight="600"
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": { textDecoration: "underline", color: "primary.main" },
                        }}
                      >
                        {post.sharedPostUser?.username || "User"}
                      </Typography>
                    }
                    subheader={
                      <Typography
                        component={Link}
                        to={`/posts/${post.sharedPostId}`}
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline", color: "primary.main" },
                        }}
                      >
                        {formatTimestamp(post.sharedPostTimestamp)}
                      </Typography>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    {post.sharedPostContent && <Typography sx={{ mb: 2, whiteSpace: "pre-line" }}>{post.sharedPostContent}</Typography>}
                    {post.sharedPostImages?.length > 0 && renderImages(post.sharedPostImages, "shared")}
                  </CardContent>
                </Card>
              )}

              {/* Post images */}
              {post.images?.length > 0 && renderImages(post.images, "post")}
            </>
          )}
        </CardContent>

        {/* Edit controls */}
        {isEditing && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, bgcolor: theme.palette.background.paper }}>
              {!post.sharedPostId && (
                <label htmlFor="upload-edit-images">
                  <input
                    id="upload-edit-images"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setEditImages((prev) => [...prev, ...files]);
                    }}
                  />
                  <Button variant="outlined" component="span">
                    Add More Photos
                  </Button>
                </label>
              )}
              <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
                <Button
                  variant="text"
                  onClick={() => {
                    setEditContent(post.content || "");
                    setEditImages(post.images || []);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSaveEdit}>
                  Save
                </Button>
              </Stack>
            </Box>
          </>
        )}

        {/* Action buttons */}
        {!isEditing && (
          <>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, bgcolor: theme.palette.background.paper }}>
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
                  <IconButton size="small">
                    <Message />
                  </IconButton>
                </Tooltip>
                <Chip label={post.commentCount || 0} size="small" variant="outlined" sx={{ height: 24, ml: 0.5 }} />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Share">
                  <IconButton onClick={() => setOpenShareModal(true)} size="small">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Copy Link">
                  <IconButton size="small" onClick={handleCopyLink}>
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

            <Divider />

            {/* Comments section - always visible in detail view */}
            <CommentSection postId={post.id} />
          </>
        )}
      </Card>

      {/* Modals */}
      <ShareModal
        openShareModal={openShareModal}
        setOpenShareModal={setOpenShareModal}
        shareContent={shareContent}
        setShareContent={setShareContent}
        handleShare={handleShare}
        sharedPostId={post.id}
      />

      <ViewImageModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={getImages()}
        currentImageIndex={currentImageIndex}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />

      <AuthDialog />
    </Box>
  );
};

export default PostDetail;
