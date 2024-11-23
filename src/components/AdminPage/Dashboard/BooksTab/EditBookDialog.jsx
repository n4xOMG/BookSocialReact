import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const EditBookDialog = ({ open, handleClose, currentBook, categories, tags, handleBookChange, handleEditSubmit, isSubmitting }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (currentBook && currentBook.bookCover) {
      setPreviewUrl(currentBook.bookCover);
    } else {
      setPreviewUrl("");
    }
  }, [currentBook]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      handleBookChange("bookCover", objectUrl); // For preview
      handleBookChange("coverFile", file); // For upload
    }
  };

  // Cleanup the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!currentBook) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Book</DialogTitle>
      <DialogContent>
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
          {/* Image Preview */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="subtitle1">Book Cover Preview:</Typography>
            {previewUrl ? (
              <img src={previewUrl} alt="Book Cover Preview" style={{ width: "200px", height: "auto", borderRadius: "4px" }} />
            ) : (
              <Typography variant="body2">No image selected.</Typography>
            )}
            <Button variant="contained" component="label">
              Upload New Cover Image
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
          </Box>

          {/* Text Fields */}
          <TextField
            label="Title"
            name="title"
            value={currentBook.title || ""}
            onChange={(e) => handleBookChange("title", e.target.value)}
            required
          />
          <TextField
            label="Author Name"
            name="authorName"
            value={currentBook.authorName || ""}
            onChange={(e) => handleBookChange("authorName", e.target.value)}
            required
          />
          <TextField
            label="Artist Name"
            name="artistName"
            value={currentBook.artistName || ""}
            onChange={(e) => handleBookChange("artistName", e.target.value)}
          />
          <TextField
            label="Description"
            name="description"
            value={currentBook.description || ""}
            onChange={(e) => handleBookChange("description", e.target.value)}
            multiline
            rows={4}
          />
          <TextField
            label="Language"
            name="language"
            value={currentBook.language || ""}
            onChange={(e) => handleBookChange("language", e.target.value)}
          />
          <FormControl>
            <InputLabel id="status-edit-label">Status</InputLabel>
            <Select
              labelId="status-edit-label"
              name="status"
              value={currentBook.status || ""}
              label="Status"
              onChange={(e) => handleBookChange("status", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="ongoing">Ongoing</MenuItem>
              <MenuItem value="finished">Finished</MenuItem>
              {/* Add more status options as needed */}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="category-edit-label">Category</InputLabel>
            <Select
              labelId="category-edit-label"
              name="category"
              multiple
              value={currentBook.categories ? currentBook.categories.map((cat) => cat.id) : []}
              label="Category"
              onChange={(e) => {
                const selectedIds = e.target.value;
                const selectedCategories = categories.filter((cat) => selectedIds.includes(cat.id));
                handleBookChange("categories", selectedCategories);
              }}
              renderValue={(selected) =>
                categories
                  .filter((cat) => selected.includes(cat.id))
                  .map((cat) => cat.name)
                  .join(", ")
              }
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No categories available
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="tags-edit-label">Tags</InputLabel>
            <Select
              labelId="tags-edit-label"
              name="tags"
              multiple
              value={currentBook.tags ? currentBook.tags.map((tag) => tag.id) : []}
              label="Tags"
              onChange={(e) => {
                const selectedIds = e.target.value;
                const selectedTags = tags.filter((tag) => selectedIds.includes(tag.id));
                handleBookChange("tags", selectedTags);
              }}
              renderValue={(selected) =>
                tags
                  .filter((tag) => selected.includes(tag.id))
                  .map((tag) => tag.name)
                  .join(", ")
              }
            >
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No tags available
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleEditSubmit} variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={20} />
              Saving...
            </Box>
          ) : (
            "Save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookDialog;
