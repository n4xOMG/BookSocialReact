import { FilterList, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function SearchBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState([
    { id: "fiction", label: "Fiction" },
    { id: "non-fiction", label: "Non-Fiction" },
    { id: "mystery", label: "Mystery" },
    { id: "sci-fi", label: "Science Fiction" },
    { id: "fantasy", label: "Fantasy" },
  ]);

  const [tags, setTags] = useState([
    { id: "bestseller", label: "Bestseller" },
    { id: "classic", label: "Classic" },
    { id: "award-winning", label: "Award-winning" },
    { id: "young-adult", label: "Young Adult" },
    { id: "romance", label: "Romance" },
  ]);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", maxWidth: 480 }}>
      <TextField
        fullWidth
        placeholder="Search books, authors, readers..."
        type="search"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handlePopoverOpen}>
                <FilterList fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ pr: 5 }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ mt: 1, width: 320 }}
      >
        <Box sx={{ p: 2, width: 320 }}>
          <Box sx={{ mx: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Categories
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {categories.map((category) => (
              <FormControlLabel key={category.id} control={<Checkbox id={category.id} />} label={category.label} sx={{ mb: 1 }} />
            ))}
          </Box>
          <Box mb={2} mx={2}>
            <Typography variant="subtitle1" fontWeight="medium">
              Tags
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {tags.map((tag) => (
              <FormControlLabel key={tag.id} control={<Checkbox id={tag.id} />} label={tag.label} sx={{ mb: 1 }} />
            ))}
          </Box>
        </Box>
      </Popover>
      <Button variant="outlined" sx={{ ml: 2, minWidth: 0, p: 1 }}>
        <Search fontSize="small" />
      </Button>
    </Box>
  );
}
