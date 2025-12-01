import { Delete, Edit, Favorite, FavoriteBorder, Link as LinkIcon, Message, Share as ShareIcon } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Divider, Grid, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, likePost } from "../../redux/post/post.action";
import ViewImageModal from "../AdminPage/Dashboard/BooksTab/ChapterModal/ViewImageModal";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";
import { Link, useNavigate } from "react-router-dom";
import { formatExactTime } from "../../utils/formatDate";

const PostImage = ({ item, index, count, handleImageClick, source }) => {
  const theme = useTheme();
  const imageUrl = typeof item === "object" ? item.url : item;
  const isMild = typeof item === "object" ? (item.isMild || item.mild) : false;
  const [isBlurred, setIsBlurred] = useState(isMild);

  return (
    <Grid
      item
      xs={count === 1 ? 12 : 6}
      sx={{
        position: "relative",
        height: count === 1 ? 300 : 200,
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
            border: "1px solid",
            borderColor: theme.palette.divider,
            transition: "transform 0.2s",
            filter: isBlurred ? "blur(20px)" : "none",
            "&:hover": {
              transform: isBlurred ? "none" : "scale(1.02)",
            },
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
            bgcolor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: "bold",
            borderRadius: 2,
            cursor: "pointer",
            backdropFilter: "blur(2px)",
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

const PostItem = ({ post, checkAuth }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(post ? post.likedByCurrentUser : false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [imageSource, setImageSource] = useState("post");

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
        {images.slice(0, 4).map((item, index) => (
          <PostImage
            key={index}
            item={item}
            index={index}
            count={count}
            handleImageClick={handleImageClick}
            source={source}
          />
        ))}
      </Grid>
    );
  };
  const formatRelativetime = (timestamp) => {
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

  const handleEdit = () => {
    navigate(`/posts/${post.id}`, { state: { editMode: true } });
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

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === getImages().length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? getImages().length - 1 : prev - 1));
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        textAlign: "left",
        borderRadius: "16px",
        overflow: "hidden",
        bgcolor: theme.palette.background.paper,
        border: "1px solid",
        borderColor: theme.palette.divider,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.light,
          transform: "translateY(-2px)",
        },
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
              cursor: "pointer",
              lineHeight: 1,
              display: "block",
              mb: 0,
              textDecoration: "none",
              color: theme.palette.text.primary,
              "&:hover": {
                textDecoration: "underline",
                color: theme.palette.primary.main,
              },
            }}
          >
            {post.user.username}
          </Typography>
        }
        subheader={
          <Tooltip title={formatExactTime(post.timestamp)} placement="bottom">
            <Typography
              component={Link}
              to={`/posts/${post.id}`}
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 0,
                lineHeight: 1,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color: theme.palette.primary.main,
                },
              }}
            >
              {formatRelativetime(post.timestamp)}
            </Typography>
          </Tooltip>
        }
        action={
          user &&
          user.id === post.user.id && (
            <>
              <IconButton onClick={handleEdit} size="small">
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
        {/* Original post content */}
        {post.content && (
          <Typography
            gutterBottom
            sx={{
              mb: 2,
              whiteSpace: "pre-line",
              fontSize: post.content.length < 50 && !post.images?.length && !post.sharedPostImages?.length ? "1.25rem" : "1rem",
              fontWeight: post.content.length < 50 && !post.images?.length && !post.sharedPostImages?.length ? 500 : 400,
              textAlign: "left",
              color: theme.palette.text.primary,
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* Display shared post information */}
        {post.sharedPostId && (
          <Card
            elevation={0}
            sx={{
              borderRadius: "12px",
              mb: 2,
              bgcolor: theme.palette.background.default,
              border: "1px solid",
              borderColor: theme.palette.divider,
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  src={post.sharedPostUser?.avatarUrl || "/placeholder.svg"}
                  alt={post.sharedPostUser?.username || "User"}
                  sx={{ width: 32, height: 32 }}
                />
              }
              title={
                <Typography
                  component={Link}
                  to={`/profile/${post.sharedPostUser.id}`}
                  variant="subtitle2"
                  fontWeight="600"
                  sx={{
                    cursor: "pointer",
                    lineHeight: 1,
                    display: "block",
                    mb: 0,
                    textDecoration: "none",
                    color: theme.palette.text.primary,
                    "&:hover": {
                      textDecoration: "underline",
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {post.sharedPostUser?.username || "User"}
                </Typography>
              }
              subheader={
                <Tooltip title={formatExactTime(post.sharedPostTimestamp)} placement="bottom">
                  <Typography
                    component={Link}
                    to={`/posts/${post.sharedPostId}`}
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mt: 0,
                      lineHeight: 1,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {formatRelativetime(post.sharedPostTimestamp)}
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
                    fontSize: "0.95rem",
                    color: theme.palette.text.primary,
                  }}
                >
                  {post.sharedPostContent}
                </Typography>
              )}
              {post.sharedPostImages?.length > 0 && renderImages(post.sharedPostImages, "shared")}
            </CardContent>
          </Card>
        )}

        {post.images?.length > 0 && renderImages(post.images, "post")}
      </CardContent>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 1.5,
          bgcolor: theme.palette.background.default,
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
            sx={{
              height: 24,
              ml: 0.5,
              borderRadius: "6px",
              fontWeight: 600,
              bgcolor: isLiked ? theme.palette.error.light : "transparent",
              color: isLiked ? theme.palette.error.contrastText : theme.palette.text.secondary,
              border: isLiked ? "none" : `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Comments">
            <IconButton onClick={toggleComments} size="small">
              <Message />
            </IconButton>
          </Tooltip>
          <Chip
            label={post.commentCount || 0}
            size="small"
            sx={{
              height: 24,
              ml: 0.5,
              borderRadius: "6px",
              fontWeight: 600,
              bgcolor: "transparent",
              color: theme.palette.text.secondary,
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
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
