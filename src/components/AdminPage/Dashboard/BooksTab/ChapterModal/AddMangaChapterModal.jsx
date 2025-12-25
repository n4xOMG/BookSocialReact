import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  alpha,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { manageChapterByBookId, publishChapterAction } from "../../../../../redux/chapter/chapter.action";
import { UploadToServer } from "../../../../../utils/uploadToServer";
import ViewImageModal from "../ChapterModal/ViewImageModal";

export default function AddMangaChapterModal({ open, onClose, bookId }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [chapter, setChapter] = useState({
    chapterNum: "",
    title: "",
    price: 0,
    locked: false,
  });

  const [images, setImages] = useState({
    imageFiles: [],
    imagePreviews: [],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChapter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLockedChange = (e) => {
    const isLocked = e.target.checked;
    setChapter((prev) => ({
      ...prev,
      locked: isLocked,
      price: isLocked && prev.price === 0 ? 10 : prev.price,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => ({
      imageFiles: [...prev.imageFiles, ...files],
      imagePreviews: [...prev.imagePreviews, ...previews],
    }));
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(images.imagePreviews[index]);
    setImages((prev) => ({
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveAllImages = () => {
    images.imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImages({
      imageFiles: [],
      imagePreviews: [],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      const folderName = `chapter_${chapter.chapterNum}_${Date.now()}`;
      const uploadedImageUrls = [];
      const totalImages = images.imageFiles.length;

      for (let i = 0; i < totalImages; i++) {
        const file = images.imageFiles[i];
        const result = await UploadToServer(file, user?.username, folderName);
        uploadedImageUrls.push(result.url);
        setUploadProgress(Math.round(((i + 1) / totalImages) * 100));
      }

      const content = uploadedImageUrls.map((url) => `<img src="${url}" alt="Chapter Image" />`).join("");

      const chapterData = {
        ...chapter,
        content,
      };

      await dispatch(publishChapterAction(bookId, chapterData));
      await dispatch(manageChapterByBookId(bookId));
      images.imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
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

  const canSubmit = chapter.chapterNum && images.imageFiles.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          maxHeight: "90vh",
          backdropFilter: "blur(20px)",
          background: theme.palette.mode === "dark" ? "rgba(26, 38, 52, 0.9)" : "rgba(255, 255, 255, 0.85)",
          boxShadow: theme.palette.mode === "dark" ? "0 24px 48px rgba(0, 0, 0, 0.5)" : "0 24px 48px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      {/* Header - Transparent to let glass background show */}
      <DialogTitle
        sx={{
          pt: 4,
          pb: 2,
          px: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
              background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            New Chapter
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 24, height: 2, bgcolor: theme.palette.secondary.main, borderRadius: 1 }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500, letterSpacing: 0.5 }}>
              MANGA UPLOAD
            </Typography>
          </Stack>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            backdropFilter: "blur(4px)",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              transform: "rotate(90deg)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {loading && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{
            mx: 4,
            borderRadius: 2,
            height: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            "& .MuiLinearProgress-bar": {
              borderRadius: 2,
              background: "linear-gradient(90deg, #c5a065 0%, #d4af37 100%)",
            },
          }}
        />
      )}

      <DialogContent sx={{ p: 4, pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={4}>
            {/* Left Column: Form Inputs */}
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ display: "block", mb: 2, letterSpacing: 1 }}>
                    Chapter Details
                  </Typography>
                  <Stack spacing={2.5}>
                    <TextField
                      required
                      fullWidth
                      name="chapterNum"
                      label="Chapter Number"
                      placeholder="e.g., 1"
                      value={chapter.chapterNum}
                      onChange={handleInputChange}
                      variant="filled"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          borderRadius: "16px",
                          bgcolor: alpha(theme.palette.background.paper, 0.4),
                          border: "1px solid",
                          borderColor: "transparent",
                          transition: "all 0.2s",
                          "&:hover": { bgcolor: alpha(theme.palette.background.paper, 0.6) },
                          "&.Mui-focused": {
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                          },
                        },
                      }}
                      InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
                    />
                    <TextField
                      fullWidth
                      name="title"
                      label="Title (Optional)"
                      placeholder="e.g., The Beginning"
                      value={chapter.title}
                      onChange={handleInputChange}
                      variant="filled"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          borderRadius: "16px",
                          bgcolor: alpha(theme.palette.background.paper, 0.4),
                          border: "1px solid",
                          borderColor: "transparent",
                          transition: "all 0.2s",
                          "&:hover": { bgcolor: alpha(theme.palette.background.paper, 0.6) },
                          "&.Mui-focused": {
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                          },
                        },
                      }}
                    />

                    <Box sx={{ position: "relative" }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: "16px",
                          border: "1px solid",
                          borderColor: chapter.locked ? theme.palette.primary.main : alpha(theme.palette.divider, 0.5),
                          bgcolor: chapter.locked ? alpha(theme.palette.primary.main, 0.05) : "transparent",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                        }}
                        onClick={() => handleLockedChange({ target: { checked: !chapter.locked } })}
                      >
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <LockIcon
                              fontSize="small"
                              sx={{ color: chapter.locked ? theme.palette.primary.main : theme.palette.text.disabled }}
                            />
                            <Typography variant="subtitle2" fontWeight={600} color={chapter.locked ? "primary" : "text.secondary"}>
                              Premium Chapter
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {chapter.locked ? "Users pay to read" : "Free for everyone"}
                          </Typography>
                        </Box>
                        <Switch checked={chapter.locked} onChange={handleLockedChange} color="primary" size="small" />
                      </Paper>

                      {/* Animated Price Field */}
                      <Box
                        sx={{
                          mt: chapter.locked ? 2 : 0,
                          height: chapter.locked ? "auto" : 0,
                          overflow: "hidden",
                          opacity: chapter.locked ? 1 : 0,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <TextField
                          label="Price (Credits)"
                          name="price"
                          type="number"
                          variant="filled"
                          value={chapter.price}
                          onChange={handleInputChange}
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                            inputProps: { min: 0 },
                            sx: {
                              borderRadius: "16px",
                              bgcolor: alpha(theme.palette.background.paper, 0.4),
                            },
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>
                                  ©
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            {/* Right Column: Upload Area */}
            <Grid item xs={12} md={7}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 1 }}>
                  Images ({images.imageFiles.length})
                </Typography>
                {images.imageFiles.length > 0 && (
                  <Button size="small" color="error" onClick={handleRemoveAllImages} sx={{ borderRadius: "8px", textTransform: "none" }}>
                    Clear All
                  </Button>
                )}
              </Stack>

              <Box
                sx={{
                  minHeight: "320px",
                  maxHeight: "450px",
                  overflowY: "auto",
                  borderRadius: "20px",
                  border: "2px dashed",
                  borderColor: alpha(theme.palette.divider, 0.4),
                  bgcolor: alpha(theme.palette.background.paper, 0.3),
                  p: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                  },
                }}
              >
                <Grid container spacing={2}>
                  {/* Upload Button Card */}
                  <Grid item xs={4} sm={4} md={4}>
                    <Box
                      sx={{
                        height: "160px",
                        borderRadius: "16px",
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: "1px solid",
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        position: "relative",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          transform: "translateY(-2px)",
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
                          inset: 0,
                          opacity: 0,
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                      />
                      <Box sx={{ p: 1.5, borderRadius: "50%", bgcolor: "white", mb: 1, boxShadow: 1 }}>
                        <AddPhotoAlternateIcon color="primary" />
                      </Box>
                      <Typography variant="button" color="primary" sx={{ textTransform: "none", fontWeight: 600 }}>
                        Add Pages
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Image Previews */}
                  {images.imagePreviews.map((preview, index) => (
                    <Grid item xs={4} sm={4} md={4} key={index}>
                      <Box
                        sx={{
                          position: "relative",
                          height: "160px",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: 1,
                          cursor: "pointer",
                          group: "true",
                          "&:hover .overlay": { opacity: 1 },
                        }}
                      >
                        <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <Box
                          className="overlay"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(0,0,0,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "all 0.2s",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{ bgcolor: "white", "&:hover": { bgcolor: "#eee" } }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewClick(index);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ bgcolor: "white", color: "error.main", "&:hover": { bgcolor: "#eee" } }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Chip
                          label={index + 1}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            height: 20,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor: "rgba(255,255,255,0.9)",
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            color: theme.palette.text.secondary,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !canSubmit}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: "translateY(-1px)",
            },
          }}
        >
          {loading ? "Publishing..." : "Publish Chapter"}
        </Button>
      </DialogActions>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
          backdropFilter: "blur(10px)",
          bgcolor: "rgba(26, 38, 52, 0.8)",
        }}
        open={loading}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={uploadProgress}
            size={80}
            thickness={2}
            sx={{ color: "rgba(255,255,255,0.3)", position: "absolute", left: 0 }}
          />
          <CircularProgress
            variant="indeterminate"
            disableShrink
            size={80}
            thickness={2}
            sx={{
              color: "#d4af37",
              animationDuration: "3s",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption" component="div" color="white" sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
              {uploadProgress}%
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ mt: 3, fontWeight: 500, fontFamily: "serif", letterSpacing: 1, color: alpha("#fff", 0.9) }}>
          UPLOADING MASTERPIECE...
        </Typography>
        <Typography variant="caption" sx={{ color: alpha("#fff", 0.6), mt: 0.5 }}>
          {Math.round((uploadProgress / 100) * images.imageFiles.length)} of {images.imageFiles.length} pages uploaded
        </Typography>
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
