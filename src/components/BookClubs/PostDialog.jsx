import ImageIcon from "@mui/icons-material/Image";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { UploadToServer } from "../../utils/uploadToServer";

const PostDialog = ({ open, onClose, onSubmit, editingPost, user }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [content, setContent] = useState("");
  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content || "");
      setSelectedImages(editingPost.images || []);
    } else {
      setContent("");
      setSelectedImages([]);
    }
  }, [editingPost]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setSubmissionError("Please enter your thoughts.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    try {

      const uploadedImageUrls = await Promise.all(
        selectedImages.map((image) => (typeof image === "string" ? image : UploadToServer(image, user?.username, `post_${Date.now()}`)))
      );

      const postData = {
        content: userCaption,
        images: uploadedImageUrls,
        user: user,
      };

      if (editingPost) {
        postData.id = editingPost.id;
      }

      await onSubmit(postData);

      // Reset form fields after submission
      if (!editingPost) {
        setContent("");
        setSelectedImages([]);
      }
    } catch (err) {
      console.error("Failed to submit post:", err);
      setSubmissionError("Failed to submit post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingPost ? "Edit Post" : "Create Post"}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          {/* Image Upload Section */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Attach Images
            </Typography>
            <IconButton component="label" color="primary" disabled={isSubmitting}>
              <ImageIcon />
              <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
            </IconButton>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {selectedImages.map((image, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <img
                    src={typeof image === "string" ? image : URL.createObjectURL(image)}
                    alt={`Upload Preview ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
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
          </Box>
          {submissionError && (
            <Typography variant="body2" color="error">
              {submissionError}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" sx={{ textTransform: "none" }} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ textTransform: "none" }} disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : editingPost ? "Update" : "Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostDialog;
