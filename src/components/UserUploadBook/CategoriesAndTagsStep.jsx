import { Box, Chip, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
export default function CategoriesAndTagsStep({ bookInfo, setBookInfo }) {
  const [tagInput, setTagInput] = useState("");

  const handleTagInput = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      setBookInfo((prev) => ({ ...prev, tags: [...prev.tags, ...newTags] }));
      setTagInput("");
    }
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (!bookInfo.categories.includes(value)) {
      setBookInfo((prev) => ({ ...prev, categories: [...prev.categories, value] }));
    }
  };

  const handleTagChange = (event) => {
    const value = event.target.value;
    if (!bookInfo.tags.includes(value)) {
      setBookInfo((prev) => ({ ...prev, tags: [...prev.tags, value] }));
    }
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <FormControl fullWidth>
          <InputLabel id="categories-label">Categories</InputLabel>
          <Select labelId="categories-label" id="categories" value="" onChange={handleCategoryChange} label="Categories">
            <MenuItem value="fiction">Fiction</MenuItem>
            <MenuItem value="non-fiction">Non-Fiction</MenuItem>
            <MenuItem value="mystery">Mystery</MenuItem>
            <MenuItem value="sci-fi">Science Fiction</MenuItem>
            <MenuItem value="romance">Romance</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {bookInfo.categories.map((category, index) => (
            <Chip key={index} label={category} color="primary" sx={{ color: "primary.contrastText" }} />
          ))}
        </Box>
      </Box>

      <Box>
        <FormControl fullWidth>
          <InputLabel id="tags-label">Tags</InputLabel>
          <Select labelId="tags-label" id="tags" value="" onChange={handleTagChange} label="Tags">
            <MenuItem value="classic">Classic</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="90s">90s</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {bookInfo.tags.map((tag, index) => (
            <Chip key={index} label={tag} color="secondary" sx={{ color: "secondary.contrastText" }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
