import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React from "react";

const BooksFilter = ({ filters, categories, tags, handleFilterChange, isDisabled }) => {
  // Book status options
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "HIATUS", label: "On Hiatus" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <Grid container spacing={2} alignItems="center">
      {/* Title Search */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          id="title-search"
          name="title"
          label="Search by Title"
          variant="outlined"
          value={filters.title || ""}
          onChange={handleFilterChange}
          disabled={isDisabled}
        />
      </Grid>

      {/* Category Filter */}
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            name="category"
            value={filters.category}
            label="Category"
            onChange={handleFilterChange}
            disabled={isDisabled || !categories.length}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Tag Filter */}
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel id="tag-select-label">Tag</InputLabel>
          <Select
            labelId="tag-select-label"
            id="tag-select"
            name="tag"
            value={filters.tag}
            label="Tag"
            onChange={handleFilterChange}
            disabled={isDisabled || !tags.length}
          >
            <MenuItem value="">All Tags</MenuItem>
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Status Filter */}
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            name="status"
            value={filters.status}
            label="Status"
            onChange={handleFilterChange}
            disabled={isDisabled}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default BooksFilter;
