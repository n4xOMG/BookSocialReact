import { Delete, Edit, Favorite, FavoriteBorder, Link as LinkIcon, Message, Share as ShareIcon } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, CardHeader, Chip, Divider, Grid, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, likePost } from "../../redux/post/post.action";
import ViewImageModal from "../AdminPage/Dashboard/BooksTab/ChapterModal/ViewImageModal";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";
import { Link, useNavigate } from "react-router-dom";
import { formatExactTime } from "../../utils/formatDate";

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
  }

  const getImages = () => imageSource === "shared" ? post.sharedPostImages : post.images;

  const renderImages = (images, source = "post") => {
    if (!images || images.length === 0) return null;

    const count = images.length;

    return (
      <Grid container spacing={1} sx={{mt: 2, mb: 1}}>
        {images.slice(0,4).map((url, index) => (
          <Grid
            key={index}
            item
            xs={
              count === 1 ? 12 :
              count === 2 ? 6 :
              count === 3 && index === 0 ? 12 : 6
            }
            sx={{
              position: "relative",
              height: 
                count === 1 ? "auto"
                : count === 2 ? (400)
                : count === 3 && index === 0 ? 250
                : 200,
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
                  bgcolor: "rgab(0,0,0,0.5)",
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
                +{count -4} more
              </Box>
            )}
          </Grid>
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
  }

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
    setCurrentImageIndex(prev =>
      prev === getImages().length - 1 ? 0 : prev + 1
    )
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? getImages().length - 1 : prev - 1
    )  
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
                          color: "primary.main",
                        }
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
              fontSize: (post.content.length < 50 && !post.images?.length && !post.sharedPostImages?.length) ? "1.5rem" : "1rem", 
              fontWeight: (post.content.length < 50 && !post.images?.length && !post.sharedPostImages?.length) ? "bold" : "normal",
              textAlign: 'justify',
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* Display shared post information */}
        {post.sharedPostId && (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: theme.palette.divider,
              mb: 2,
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)"
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
                                color: "primary.main",
                              }
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
                    fontSize: "1rem", 
                    fontWeight: "normal",
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
