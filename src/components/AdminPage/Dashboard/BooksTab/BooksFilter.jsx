import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, CircularProgress, Alert, Typography } from "@mui/material";

const BooksFilter = ({ filters, categories, tags, handleFilterChange, isDisabled }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 2,
        flexWrap: "wrap",
      }}
    >
      <FormControl sx={{ minWidth: 150 }} disabled={isDisabled || !categories.length}>
        <InputLabel id="category-filter-label">Category</InputLabel>
        <Select labelId="category-filter-label" name="category" value={filters.category} label="Category" onChange={handleFilterChange}>
          <MenuItem value="">All</MenuItem>
          {categories.length > 0 ? (
            categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No categories available
            </MenuItem>
          )}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }} disabled={isDisabled || !tags.length}>
        <InputLabel id="tag-filter-label">Tag</InputLabel>
        <Select labelId="tag-filter-label" name="tag" value={filters.tag} label="Tag" onChange={handleFilterChange}>
          <MenuItem value="">All</MenuItem>
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

      <FormControl sx={{ minWidth: 150 }} disabled={isDisabled}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select labelId="status-filter-label" name="status" value={filters.status} label="Status" onChange={handleFilterChange}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="ongoing">Ongoing</MenuItem>
          <MenuItem value="finished">Finished</MenuItem>
        </Select>
      </FormControl>

      {/* Display messages if categories or tags are not available */}
      {isDisabled && (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={20} />
          <Typography variant="body2">Loading filters...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default BooksFilter;
