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
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { UploadToServer } from "../../../../utils/uploadToServer";
import { editBookAction } from "../../../../redux/book/book.action";

const EditBookDialog = ({ open, handleClose, currentBook, categories, tags }) => {
  const dispatch = useDispatch();

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
  const theme = useTheme();

  useEffect(() => {
    if (currentBook) {
      setTitle(currentBook.title || "");
      setDescription(currentBook.description || "");
      setLanguage(currentBook.language || "");
      setStatus(currentBook.status || "");
      setCategory(currentBook.categoryId || "");
      setSelectedTags(currentBook.tagIds || []);
      const cover = currentBook.bookCover;
      if (cover && typeof cover === "object") {
        setBookCoverPreview(cover.url || "");
      } else {
        setBookCoverPreview(cover || "");
      }
      setCoverFile(null);
    }
  }, [currentBook]);
  const resolveUsername = () => {
    if (!currentBook) return "admin";
    return currentBook.author?.username || currentBook.authorName || "admin";
  };
  const handleSubmit = async () => {
    if (!title || !description || !language || !status || !category) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    let updatedBookCover = currentBook?.bookCover ?? null;
    setLoading(true);
    if (coverFile) {
      try {
        const uploadResult = await UploadToServer(coverFile, resolveUsername(), `book_${title}_${Date.now()}`);
        updatedBookCover = {
          url: uploadResult.url,
          isMild: uploadResult.safety?.level === "MILD",
        };
      } catch (uploadError) {
        console.error("Failed to upload image:", uploadError);
        setError("Failed to upload the book cover. Please try again.");
        setLoading(false);
        return;
      }
    } else if (updatedBookCover && typeof updatedBookCover === "string") {
      updatedBookCover = { url: updatedBookCover };
    }

    const updatedBook = {
      ...currentBook,
      title,
      description,
      language,
      status,
      categoryId: category,
      tagIds: selectedTags,
      bookCover: updatedBookCover,
    };

    try {
      await dispatch(editBookAction(currentBook.id, updatedBook));
      handleClose();
    } catch (updateError) {
      console.error("Failed to update book:", updateError);
      setError(updateError?.message || "Failed to update the book. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    const newTags = typeof value === "string" ? value.split(",") : value;
    setSelectedTags(newTags);
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
      <DialogTitle sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>Edit Book</DialogTitle>
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
              onChange={handleTagChange}
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Book Cover
            </Typography>
            {bookCoverPreview && (
              <Box mt={2} sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <img src={bookCoverPreview} alt="Book Cover Preview" style={{ width: "100%", maxWidth: "200px", borderRadius: "4px" }} />
              </Box>
            )}
            <Button variant="contained" component="label">
              Upload New Cover
              <input type="file" accept="image/*" hidden onChange={handleCoverChange} />
            </Button>
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ fontWeight: "bold", color: "white", "&:hover": { color: theme.palette.primary.dark } }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookDialog;
