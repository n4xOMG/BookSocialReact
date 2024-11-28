import React, { useEffect, useState } from "react";
import { Box, Button, Avatar, TextField, IconButton, Typography, Stack, Paper, CircularProgress } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { addPost, fetchPosts } from "../../redux/post/post.action";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
import Sidebar from "../../components/HomePage/Sidebar";
import PostList from "../../components/BookClubs/PostList";
import { useAuthCheck } from "../../utils/useAuthCheck";

const BookClubs = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const { checkAuth, AuthDialog } = useAuthCheck();
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

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
      const uploadedImageUrls = await Promise.all(selectedImages.map((image) => UploadToCloudinary(image, "bookposts")));

      const postData = {
        content: postContent,
        images: uploadedImageUrls,
        user: user,
      };

      await dispatch(addPost(postData));

      setPostContent("");
      setSelectedImages([]);
    } catch (err) {
      console.error("Failed to add post:", err);
      setSubmissionError("Failed to add post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Box sx={{ display: "flex", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box sx={{ width: "100%", mx: "auto", p: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar alt={user?.username || "User"} src={user?.profilePicture || ""} />
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
              />
              {/* Images Preview */}
              {selectedImages.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {selectedImages.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
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
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        &#10005;
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
              {/* Action Buttons */}
              <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center">
                {/* Image Upload Button */}
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
                  <IconButton color="primary" component="span">
                    <ImageIcon />
                  </IconButton>
                </label>
                {/* Submit Button */}
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmitPost}
                  disabled={isSubmitting}
                  sx={{ textTransform: "none" }}
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
      </Box>
      <AuthDialog />
    </Box>
  );
};

export default BookClubs;
