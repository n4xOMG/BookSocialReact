import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Avatar,
  TextField,
  IconButton,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Pagination,
  useMediaQuery,
  useTheme,
  Container,
  Divider,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { addPost, fetchPosts } from "../../redux/post/post.action";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
import Sidebar from "../../components/HomePage/Sidebar";
import PostList from "../../components/BookClubs/PostList";
import { useAuthCheck } from "../../utils/useAuthCheck";
import { UploadToServer } from "../../utils/uploadToServer";

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
      const uploadedImageUrls = await Promise.all(selectedImages.map((image) => UploadToServer(image, user.username, "bookposts")));

      const postData = {
        content: postContent,
        images: uploadedImageUrls,
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />
      <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: theme.palette.background.paper,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Share with the community
          </Typography>
          <Divider sx={{ mb: 2 }} />
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
                sx={{ mb: 2 }}
              />
              {/* Images Preview */}
              {selectedImages.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
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
                          top: 0,
                          right: 0,
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
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
                    <Button variant="outlined" component="span" startIcon={<ImageIcon />}>
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
                    px: 3,
                    py: 1,
                    borderRadius: 2,
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
