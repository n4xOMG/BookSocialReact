import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { manageChapterByBookId, publishChapterAction } from "../../../../../redux/chapter/chapter.action";
import UploadToCloudinary from "../../../../../utils/uploadToCloudinary";
import ViewImageModal from "../ChapterModal/ViewImageModal";

export default function AddMangaChapterModal({ open, onClose, bookId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [chapter, setChapter] = useState({
    chapterNum: "",
    title: "",
    price: 0,
    locked: false,
    content: "",
  });

  const [images, setImages] = useState({
    imageFiles: [],
    imagePreviews: [],
    imageLinks: [],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChapter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      imagePreviews: [...prev.imagePreviews, ...previews],
    }));
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveAllImages = () => {
    // Release object URLs to prevent memory leaks
    images.imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

    setImages({
      imageFiles: [],
      imagePreviews: [],
      imageLinks: [],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Upload all images to Cloudinary
      const uploadedImageLinks = await Promise.all(images.imageFiles.map((file) => UploadToCloudinary(file, `${bookId}_${Date.now()}`)));

      // Update content with image links
      const serializedContent = JSON.stringify(chapter.content);
      const updatedContent = uploadedImageLinks.reduce(
        (acc, link) => acc + `<img src="${link}" alt="Chapter Image" />`,
        DOMPurify.sanitize(serializedContent)
      );

      const chapterData = {
        ...chapter,
        content: updatedContent,
        imageLinks: uploadedImageLinks,
      };

      await dispatch(publishChapterAction(bookId, chapterData));
      await dispatch(manageChapterByBookId(bookId));
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handlePreviewClick = (index) => {
    setSelectedImage(images.imagePreviews[index]);
  };

  const handleNextImage = () => {
    const currentIndex = images.imagePreviews.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % images.imagePreviews.length;
    setSelectedImage(images.imagePreviews[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = images.imagePreviews.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + images.imagePreviews.length) % images.imagePreviews.length;
    setSelectedImage(images.imagePreviews[prevIndex]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Add New Manga Chapter
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="chapterNum"
              label="Chapter number"
              value={chapter.chapterNum}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              fullWidth
              name="title"
              label="Chapter title"
              value={chapter.title}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              label="Price"
              name="price"
              type="number"
              variant="outlined"
              min={0}
              value={chapter.price}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{
                inputProps: { min: 0 },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={<Checkbox checked={chapter.locked} onChange={handleInputChange} name="locked" color="primary" />}
              label="Is Locked"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Chapter Images
            </Typography>
            {images.imageFiles.length > 0 && (
              <Tooltip title="Delete all images">
                <Button color="error" startIcon={<DeleteSweepIcon />} onClick={handleRemoveAllImages} variant="outlined" size="small">
                  Delete All
                </Button>
              </Tooltip>
            )}
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3} sx={{ position: "relative" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "140px",
                    borderRadius: "8px",
                    border: "2px dashed",
                    borderColor: "grey.400",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <input
                    type="file"
                    multiple
                    name="images"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  />
                  <AddPhotoAlternateIcon sx={{ fontSize: 48, color: "grey.500", mb: 1 }} />
                  <Typography variant="caption" color="textSecondary">
                    Add Images
                  </Typography>
                </Box>
              </Grid>

              {images.imagePreviews.map((preview, index) => (
                <Grid item xs={6} sm={4} md={3} key={index} sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      position: "relative",
                      height: "140px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: 1,
                      "&:hover": {
                        boxShadow: 3,
                        "& .image-overlay": {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      className="image-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        zIndex: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        size="small"
                        sx={{
                          color: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          m: 0.5,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handlePreviewClick(index)}
                        size="small"
                        sx={{
                          color: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          m: 0.5,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          },
                        }}
                      >
                        <AddPhotoAlternateIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 2 }} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !chapter.chapterNum}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? "Uploading..." : "Upload Chapter"}
          </Button>
        </Box>
      </Box>

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {selectedImage && (
        <ViewImageModal
          open={true}
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </Dialog>
  );
}
