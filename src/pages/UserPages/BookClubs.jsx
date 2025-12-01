import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostList from "../../components/BookClubs/PostList";
import { addPost, fetchPosts } from "../../redux/post/post.action";
import { UploadToServer } from "../../utils/uploadToServer";
import { useAuthCheck } from "../../utils/useAuthCheck";

const BookClubs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { posts, loading, error, pagination } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const { checkAuth, AuthDialog } = useAuthCheck();
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [page, setPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchPosts(page, postsPerPage));
  }, [dispatch, page, postsPerPage]);

  const handlePageChange = (event, value) => {
    setPage(value - 1); // API uses 0-based indexing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmitPost = checkAuth(async () => {
    if (isSubmitting) return;

    if (!postContent.trim() && selectedImages.length === 0) {
      setSubmissionError("Please enter some text or select images to post.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const uploadResults = await Promise.all(selectedImages.map((image) => UploadToServer(image, user.username, "bookposts")));
      const uploadedImageObjects = uploadResults.map((result) => ({
        url: result.url,
        isMild: result.safety?.level === "MILD"
      }));

      const postData = {
        content: postContent,
        images: uploadedImageObjects,
        user: user,
      };

      await dispatch(addPost(postData));

      setPostContent("");
      setSelectedImages([]);
      // Refresh the first page to show the new post
      if (page !== 0) setPage(0);
      else dispatch(fetchPosts(0, postsPerPage));
    } catch (err) {
      console.error("Failed to add post:", err);
      setSubmissionError("Failed to add post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Box sx={{ display: "flex", minHeight: "100%", bgcolor: theme.palette.background.default }}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: "16px",
            bgcolor: theme.palette.background.paper,
            border: "1px solid",
            borderColor: theme.palette.divider,
            boxShadow: theme.shadows[1],
          }}
        >
          <Typography
            variant="h5"
            className="font-serif"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: "1.75rem",
              color: theme.palette.text.primary,
            }}
          >
            Share with the community
          </Typography>
          <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar alt={user?.username || "User"} src={user?.avatarUrl || ""} sx={{ width: 48, height: 48 }} />
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                label={`What are you reading, ${user?.username || "User"}?`}
                multiline
                minRows={3}
                maxRows={6}
                variant="outlined"
                fullWidth
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your thoughts..."
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: theme.palette.background.default,
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              {/* Images Preview */}
              {selectedImages.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    p: 2,
                    borderRadius: "12px",
                    bgcolor: theme.palette.background.default,
                    border: "1px solid",
                    borderColor: theme.palette.divider,
                  }}
                >
                  {selectedImages.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                      }}
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Selected ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: theme.palette.background.paper,
                          border: "1px solid",
                          borderColor: theme.palette.divider,
                          "&:hover": {
                            bgcolor: theme.palette.action.hover,
                          },
                          width: 24,
                          height: 24,
                        }}
                      >
                        &#10005;
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="center" justifyContent="space-between">
                <Box>
                  <label htmlFor="upload-images">
                    <input
                      style={{ display: "none" }}
                      id="upload-images"
                      name="upload-images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<ImageIcon />}
                      sx={{
                        borderRadius: "8px",
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {isMobile ? "Photo" : "Add Photo"}
                    </Button>
                  </label>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmitPost}
                  disabled={isSubmitting}
                  size="large"
                  sx={{
                    textTransform: "none",
                    px: 4,
                    py: 1,
                    borderRadius: "8px",
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 700,
                    boxShadow: theme.shadows[2],
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                      boxShadow: theme.shadows[4],
                      transform: "translateY(-1px)",
                    },
                    "&:disabled": {
                      bgcolor: theme.palette.action.disabledBackground,
                    },
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Post"}
                </Button>
              </Stack>

              {/* Display Submission Error */}
              {submissionError && (
                <Typography variant="body2" color="error" mt={1}>
                  {submissionError}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>

        {/* Posts List */}
        <PostList posts={posts} loading={loading} error={error} checkAuth={checkAuth} />

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage + 1}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        )}
      </Container>
      <AuthDialog />
    </Box>
  );
};

export default BookClubs;
