import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import UploadToCloudinary from "../../../../utils/uploadToCloudinary";
import { editBookAction } from "../../../../redux/book/book.action";

const EditBookDialog = ({ open, handleClose, currentBook, categories, tags }) => {
  const dispatch = useDispatch();

  // Local state for the form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [bookCoverPreview, setBookCoverPreview] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (currentBook) {
      setTitle(currentBook.title || "");
      setDescription(currentBook.description || "");
      setLanguage(currentBook.language || "");
      setStatus(currentBook.status || "");
      setCategory(currentBook.categoryId || "");
      setSelectedTags(currentBook.tagIds || []);
      setBookCoverPreview(currentBook.bookCover || "");
      setCoverFile(null);
    }
  }, [currentBook]);

  const handleSubmit = async () => {
    // Basic validation
    if (!title || !description || !language || !status || !category) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");

    let uploadedImageUrl = currentBook.bookCover;
    setLoading(true);
    if (coverFile) {
      try {
        uploadedImageUrl = await UploadToCloudinary(coverFile, "books");
      } catch (uploadError) {
        console.error("Failed to upload image:", uploadError);
        setError("Failed to upload the book cover. Please try again.");
        return;
      }
    }

    const updatedBook = {
      ...currentBook,
      title,
      description,
      language,
      status,
      categoryId: category,
      tagIds: selectedTags,
      bookCover: uploadedImageUrl,
    };

    try {
      await dispatch(editBookAction(currentBook.id, updatedBook));
      handleClose(); // Close the dialog upon successful submission
    } catch (updateError) {
      console.error("Failed to update book:", updateError);
      setError("Failed to update the book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverFile(file);
      setBookCoverPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Book</DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
          noValidate
          autoComplete="off"
        >
          {/* Title Field */}
          <TextField label="Title" variant="outlined" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />

          {/* Description Field */}
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Language Field */}
          <TextField
            label="Language"
            variant="outlined"
            fullWidth
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />

          {/* Status Field */}
          <TextField label="Status" variant="outlined" fullWidth required value={status} onChange={(e) => setStatus(e.target.value)} />

          {/* Category Selection (Single Select) */}
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No Categories Available
                </MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Tags Selection (Multiple Select) */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="tags-select-label">Tags</InputLabel>
            <Select
              labelId="tags-select-label"
              id="tags-select"
              multiple
              value={selectedTags}
              onChange={handleTagsChange}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId); // Find the tag object by ID
                    return <Chip key={tagId} label={tag?.name || "Unknown"} size="small" />;
                  })}
                </Box>
              )}
            >
              {tags && tags.length > 0 ? (
                tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No Tags Available
                </MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Book Cover Upload */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Book Cover
            </Typography>
            <Button variant="contained" component="label">
              Upload Cover
              <input type="file" accept="image/*" hidden onChange={handleCoverChange} />
            </Button>
            {bookCoverPreview && (
              <Box mt={2} sx={{ position: "relative", display: "inline-block" }}>
                <img src={bookCoverPreview} alt="Book Cover Preview" style={{ width: "100%", maxWidth: "200px", borderRadius: "4px" }} />
                {coverFile && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setCoverFile(null);
                      setBookCoverPreview(currentBook.bookCover || "");
                    }}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    ✕
                  </IconButton>
                )}
              </Box>
            )}
          </Box>

          {/* Display Error Message */}
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookDialog;
