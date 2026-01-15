import { Delete, Edit, Favorite, FavoriteBorder, Link as LinkIcon, Message, Share as ShareIcon, MenuBook } from "@mui/icons-material";
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
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ViewImageModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/ViewImageModal";
import CommentSection from "../../components/BookClubs/CommentSection";
import ShareModal from "../../components/BookClubs/ShareModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { addPost, deletePost, fetchPostById, likePost, updatePost } from "../../redux/post/post.action";
import { formatExactTime, formatRelativeTime } from "../../utils/formatDate";
import { UploadToServer } from "../../utils/uploadToServer";
import { useAuthCheck } from "../../utils/useAuthCheck";

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

  // PostImage component to handle mild content censoring
  const PostImage = ({ item, index, count, source }) => {
    const imageUrl = typeof item === "string" ? item : item?.url || "";
    const isMild = typeof item === "object" ? (item.isMild || item.mild) : false;
    const [isBlurred, setIsBlurred] = useState(isMild);

    return (
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
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            onClick={() => !isBlurred && handleImageClick(index, source)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: isBlurred ? "default" : "pointer",
              filter: isBlurred ? "blur(20px)" : "none",
              transition: "filter 0.3s ease",
            }}
          />
          {isBlurred && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "rgba(0,0,0,0.3)",
                zIndex: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: "white", mb: 1, fontWeight: "bold" }}>
                Mild Content
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBlurred(false);
                }}
                sx={{
                  bgcolor: "rgba(0,0,0,0.6)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                }}
              >
                Show
              </Button>
            </Box>
          )}
        </Box>
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
              zIndex: 2,
            }}
            onClick={() => handleImageClick(index, source)}
          >
            +{count - 4} more
          </Box>
        )}
      </Grid>
    );
  };

  const renderImages = (images, source = "post") => {
    if (!images || images.length === 0) return null;

    const count = images.length;

    return (
      <Grid container spacing={1} sx={{ mt: 2, mb: 1 }}>
        {images.slice(0, 4).map((item, index) => (
          <PostImage
            key={index}
            item={item}
            index={index}
            count={count}
            source={source}
          />
        ))}
      </Grid>
    );
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
    const existingImages = editImages.filter((img) => !(img instanceof File));

    try {
      const uploadResults = await Promise.all(newFiles.map((file) => UploadToServer(file, user.username, "bookposts")));
      const uploadedImageObjects = uploadResults.map((result) => ({
        url: result.url,
        isMild: result.safety?.level === "MILD"
      }));

      const postData = {
        content: editContent,
        images: [...existingImages, ...uploadedImageObjects],
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
    <>
      <Box sx={{ maxWidth: 800, mx: "auto", p: 2, textAlign: "left" }}>
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
                onClick={() => navigate(`/profile/${post.user.id}`)}
                variant="subtitle1" 
                fontWeight="600" 
                sx={{ 
                  cursor: "pointer", 
                  lineHeight: 1, 
                  display: "block",
                  mb: 0,
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                            textDecoration: "underline",
                            color: "primary.main",
                          }
                  }}
              >
                {post.user.username}
              </Typography>
            }
            subheader={
              <Tooltip title={formatExactTime(post.timestamp)} placement="bottom">
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{
                    mt: 0, 
                    lineHeight: 1,
                  }}
                >
                  {formatRelativeTime(post.timestamp)}
                </Typography>
              </Tooltip>
                
              }
            action={
              user &&
              user.id === post.user.id && (
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
                      src={
                        typeof img === "string" 
                          ? img 
                          : (img instanceof File || img instanceof Blob)
                            ? URL.createObjectURL(img) 
                            : img?.url || ""
                      }
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
                        cursor: "pointer"
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

              {/* Shared post / book display */}
              {post.postType === 'BOOK_SHARE' && post.sharedBook ? (
                  <Card
                      elevation={0}
                      sx={{
                          borderRadius: "12px",
                          mb: 2,
                          display: "flex",
                          overflow: "hidden",
                          border: "1px solid",
                          borderColor: theme.palette.divider,
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                              transform: "scale(1.02)",
                              borderColor: theme.palette.primary.main,
                              boxShadow: theme.shadows[3],
                          }
                      }}
                      onClick={() => navigate(`/books/${post.sharedBook.id}`)}
                  >
                      <Box
                          component="img"
                          src={post.sharedBook.bookCover?.url || "/placeholder.svg"}
                          alt={post.sharedBook.title}
                          sx={{
                              width: 100,
                              minWidth: 100,
                              height: 150,
                              objectFit: "cover",
                          }}
                      />
                      <Box sx={{ p: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.3, mb: 0.5 }}>
                              {post.sharedBook.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              by {post.sharedBook.author?.name || "Unknown Author"}
                          </Typography>
                          <Box 
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 0.5,
                              color: theme.palette.primary.main 
                            }}
                          >
                              <MenuBook fontSize="small" />
                              <Typography variant="caption" fontWeight="600">
                                 Read Now
                              </Typography>
                          </Box>
                      </Box>
                  </Card>
              ) : post.sharedPostId && (
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: theme.palette.divider,
                    mb: 2,
                    boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Check if shared post was deleted */}
                  {!post.sharedPostUser ? (
                    <CardContent>
                      <Box
                        sx={{
                          p: 3,
                          textAlign: "center",
                          bgcolor: theme.palette.action.hover,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          This post has been deleted.
                        </Typography>
                      </Box>
                    </CardContent>
                  ) : (
                    <>
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
                            onClick={() => navigate(`/profile/${post.sharedPostUser.id}`)}
                            variant="subtitle2"
                            fontWeight="600"
                            sx={{
                              textDecoration: "none",
                              color: "inherit",
                              "&:hover": { textDecoration: "underline", color: "primary.main" },
                              cursor: "pointer"
                            }}
                        >
                          {post.sharedPostUser?.username || "User"}
                        </Typography>
                      }
                      subheader={
                        <Tooltip title={formatExactTime(post.sharedPostTimestamp)} placement="bottom">
                          <Typography 
                            onClick={() => navigate(`/posts/${post.sharedPostId}`)}
                            variant="caption" 
                            color="text.secondary" 
                            sx={{
                              mt: 0, 
                              lineHeight: 1,
                              textDecoration: "none",
                              "&:hover": {
                                        textDecoration: "underline",
                                        color: "primary.main",
                                          },
                                  cursor: "pointer",
                            }}
                          >
                            {formatRelativeTime(post.sharedPostTimestamp)}
                          </Typography>
                        </Tooltip>

                      }
                    />
                    <CardContent sx={{ pt: 0 }}>
                      {post.sharedPostContent && (
                        <Typography
                          sx={{
                            mb: 2,
                            whiteSpace: "pre-line",
                            fontSize: "1rem", 
                            fontWeight: "normal",
                          }}
                        >
                          {post.sharedPostContent}
                        </Typography>
                      )}
                      {post.sharedPostImages?.length > 0 && renderImages(post.sharedPostImages, "shared")}
                    </CardContent>
                    </>
                  )}
                </Card>
              )}
            
            {!isEditing && (
              post.images?.length > 0 && renderImages(post.images, "post")
            )}
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
    </>
  );
};

export default PostDetail;
