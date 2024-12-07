import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Checkbox, Dialog, FormControlLabel, Grid, IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editChapterAction, manageChapterByBookId } from "../../../../../redux/chapter/chapter.action";
import UploadToCloudinary from "../../../../../utils/uploadToCloudinary";
import { isTokenExpired } from "../../../../../utils/useAuthCheck";
import LoadingSpinner from "../../../../LoadingSpinner";
import ViewImageModal from "./ViewImageModal";
export default function EditMangaChapterModal({ open, onClose, bookId, chapterDetails }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const [chapter, setChapter] = useState({
    id: chapterDetails.id,
    bookId: bookId,
    chapterNum: chapterDetails.chapterNum,
    title: chapterDetails.title,
    content: chapterDetails.content,
    locked: chapterDetails.locked,
    price: chapterDetails.price,
  });

  const [images, setImages] = useState({
    imageFiles: [],
    imagePreviews: [],
    imageLinks: [],
  });
  const extractImageUrlsFromContent = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    const imgTags = doc.querySelectorAll("img");
    const imageUrls = Array.from(imgTags).map((img) => img.src);
    return imageUrls;
  };

  useEffect(() => {
    if (chapter.content) {
      const imageUrls = extractImageUrlsFromContent(chapter.content);
      setImages((prev) => ({
        ...prev,
        imagePreviews: imageUrls,
        imageLinks: imageUrls,
      }));
    }
  }, [chapter.content]);
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
    // Remove the selected image from image files, previews, and links
    const newImageFiles = images.imageFiles.filter((_, i) => i !== index);
    const newImagePreviews = images.imagePreviews.filter((_, i) => i !== index);
    const newImageLinks = images.imageLinks.filter((_, i) => i !== index);

    // Regenerate content only from the remaining image links
    const updatedContent = newImageLinks.reduce((acc, link) => acc + `<img src="${link}" alt="Chapter Image" />`, "");

    setImages({
      imageFiles: newImageFiles,
      imagePreviews: newImagePreviews,
      imageLinks: newImageLinks,
    });

    setChapter((prev) => ({
      ...prev,
      content: updatedContent, // Replace content with new image tags only
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Upload all new images to Cloudinary
      const uploadedImageLinks = await Promise.all(
        images.imageFiles.map((file) => UploadToCloudinary(file, `Chapter_${chapter.chapterNum}_${chapter.title}`))
      );

      // Combine existing and newly uploaded image links
      const allImageLinks = [...(images.imageLinks || []), ...uploadedImageLinks];

      // Update content with both new and existing image links
      const updatedContent = allImageLinks.reduce((acc, link) => acc + `<img src="${link}" alt="Chapter Image" />`, "");

      const chapterData = {
        ...chapter,
        content: updatedContent,
        imageLinks: allImageLinks,
      };

      await dispatch(editChapterAction(bookId, chapterData));
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ borderRadius: 1, borderColor: "#0c0a09", px: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="chapterNum"
              label="Chapter number"
              value={chapter.chapterNum}
              onChange={handleInputChange}
            />
            <TextField margin="normal" fullWidth name="title" label="Chapter title" value={chapter.title} onChange={handleInputChange} />
            <TextField
              margin="normal"
              label="Price"
              name="price"
              type="number"
              min={0}
              value={chapter.price}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControlLabel
              control={<Checkbox checked={chapter.locked} onChange={handleInputChange} name="locked" color="primary" />}
              label="Is Locked"
            />
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={4} md={3} sx={{ position: "relative", cursor: "pointer" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    border: "2px dashed grey",
                    position: "relative",
                    overflow: "hidden",
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
                    }}
                  />
                  <AddPhotoAlternateIcon sx={{ fontSize: 48, color: "grey" }} />
                </Box>
              </Grid>

              {/* Existing and new image previews */}
              {images.imagePreviews.map((preview, index) => (
                <Grid item xs={6} sm={4} md={3} key={index} sx={{ position: "relative", cursor: "pointer" }}>
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                    onClick={() => handlePreviewClick(index)}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              ))}
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Save
            </Button>
          </Box>
          {selectedImage && (
            <ViewImageModal
              open={true}
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
              onNext={handleNextImage}
              onPrev={handlePrevImage}
              user={user}
            />
          )}
        </>
      )}
    </Dialog>
  );
}
