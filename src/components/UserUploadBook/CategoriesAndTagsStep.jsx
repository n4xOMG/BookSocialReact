import { Alert, Box, Chip, CircularProgress, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";

export default function CategoriesAndTagsStep({ bookInfo, setBookInfo }) {
  const dispatch = useDispatch();
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.category);
  const { tags, loading: tagsLoading, error: tagsError } = useSelector((state) => state.tag);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getTags());
  }, [dispatch]);

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    const newTags = typeof value === "string" ? value.split(",") : value;
    setBookInfo((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const handleDeleteTag = (tagToDelete) => () => {
    const newTags = bookInfo.tags.filter((tag) => tag.id !== tagToDelete.id);
    setBookInfo((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Categories Section */}
      <Box>
        <FormControl fullWidth>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={bookInfo.category}
            onChange={(event) => setBookInfo({ ...bookInfo, category: event.target.value })}
            input={<OutlinedInput label="Category" />}
            disabled={categoriesLoading}
            renderValue={(selected) => <Typography>{selected ? selected.name : ""}</Typography>}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tags Section */}
      <Box>
        <FormControl fullWidth>
          <InputLabel id="tags-label">Tags</InputLabel>
          <Select
            labelId="tags-label"
            id="tags"
            multiple
            value={bookInfo.tags}
            onChange={handleTagChange}
            input={<OutlinedInput label="Tags" />}
            disabled={tagsLoading}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((tag) => (
                  <Chip key={tag.id} label={tag.name} onDelete={handleDeleteTag(tag)} />
                ))}
              </Box>
            )}
          >
            {tagsLoading ? (
              <MenuItem>
                <CircularProgress size={24} />
              </MenuItem>
            ) : tagsError ? (
              <MenuItem>
                <Alert severity="error">Failed to load tags</Alert>
              </MenuItem>
            ) : (
              tags.map((tag) => (
                <MenuItem key={tag.id} value={tag}>
                  {tag.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        {/* Display Selected Tags as Chips */}
        {bookInfo.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {bookInfo.tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                color="secondary"
                onDelete={handleDeleteTag(tag)}
                sx={{ color: "secondary.contrastText" }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
