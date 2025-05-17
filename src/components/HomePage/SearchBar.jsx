import {
  alpha,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  Fade,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Close, FilterAlt, Search } from "@mui/icons-material";
import SearchDropdown from "./SearchDropdown";

const SearchBar = memo(({ tags = [], categories = [] }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Close popper when clicking outside
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpen(false);
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const tagIds = selectedTags.map((tag) => tag.id);
    const categoryId = selectedCategory ? selectedCategory.id : null;

    const params = new URLSearchParams();
    if (searchTitle) params.append("title", searchTitle);
    if (categoryId) params.append("categoryId", categoryId);
    if (tagIds && tagIds.length > 0) tagIds.forEach((id) => params.append("tagIds", id));

    navigate(`/search-results?${params}`);
    setOpen(false);
    setShowDropdown(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleInputFocus = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(true);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedCategory(null);
  };

  const handleTagChange = (event, values) => {
    setSelectedTags(values);
  };

  const handleCategoryChange = (event, value) => {
    setSelectedCategory(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTitle(e.target.value);
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const hasFilters = selectedTags.length > 0 || selectedCategory;

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 600 }} ref={searchRef}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          px: 2,
          py: 0.75,
          backgroundColor: theme.palette.action.hover,
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": {
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 1px ${theme.palette.divider}`,
          },
        }}
      >
        <InputBase
          placeholder="Search for books..."
          value={searchTitle}
          onChange={handleSearchChange}
          onClick={handleInputFocus}
          onFocus={handleInputFocus}
          onKeyPress={handleKeyPress}
          fullWidth
          ref={inputRef}
          sx={{
            fontSize: "0.95rem",
          }}
          startAdornment={
            <InputAdornment position="start">
              <Search fontSize="small" color="action" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClick}
                sx={{
                  backgroundColor: hasFilters ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                  color: hasFilters ? theme.palette.primary.main : theme.palette.text.secondary,
                  "&:hover": {
                    backgroundColor: hasFilters ? alpha(theme.palette.primary.main, 0.2) : theme.palette.action.hover,
                  },
                }}
              >
                <FilterAlt fontSize="small" />
                {hasFilters && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
      </Paper>

      <SearchDropdown anchorEl={showDropdown ? inputRef.current : null} searchQuery={searchTitle} onClose={closeDropdown} />

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        sx={{
          zIndex: 1300,
          width: { xs: "calc(100vw - 32px)", sm: "auto" },
          minWidth: { xs: "auto", sm: 400 },
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Card
              elevation={4}
              sx={{
                mt: 1,
                overflow: "visible",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: -8,
                  left: 20,
                  width: 16,
                  height: 16,
                  bgcolor: "background.paper",
                  transform: "rotate(45deg)",
                  zIndex: 0,
                  borderLeft: `1px solid ${theme.palette.divider}`,
                  borderTop: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Advanced Search
                  </Typography>
                  <IconButton size="small" onClick={() => setOpen(false)}>
                    <Close fontSize="small" />
                  </IconButton>
                </Stack>

                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <FormLabel sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>Book Title</FormLabel>
                    <TextField
                      autoFocus
                      size="small"
                      placeholder="Enter book title"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <FormLabel sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>Category</FormLabel>
                    <Autocomplete
                      size="small"
                      options={categories}
                      getOptionLabel={(option) => option.name}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      renderInput={(params) => <TextField {...params} placeholder="Select a category" variant="outlined" />}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <FormLabel sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>Tags</FormLabel>
                    <Autocomplete
                      multiple
                      size="small"
                      options={tags}
                      getOptionLabel={(option) => option.name}
                      value={selectedTags}
                      onChange={handleTagChange}
                      disableCloseOnSelect
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            size="small"
                          />
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => <TextField {...params} placeholder="Select tags" variant="outlined" />}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => <Chip label={option.name} size="small" {...getTagProps({ index })} />)
                      }
                    />
                  </FormControl>

                  {(selectedTags.length > 0 || selectedCategory) && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Active filters:
                      </Typography>
                      {selectedCategory && (
                        <Chip label={selectedCategory.name} size="small" onDelete={() => setSelectedCategory(null)} sx={{ height: 24 }} />
                      )}
                      {selectedTags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          onDelete={() => setSelectedTags(selectedTags.filter((t) => t.id !== tag.id))}
                          sx={{ height: 24 }}
                        />
                      ))}
                      {selectedTags.length > 2 && <Chip label={`+${selectedTags.length - 2} more`} size="small" sx={{ height: 24 }} />}
                      <Button size="small" onClick={clearFilters} sx={{ ml: "auto", fontSize: "0.7rem" }}>
                        Clear all
                      </Button>
                    </Box>
                  )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSearch}
                    startIcon={<Search fontSize="small" />}
                    disableElevation
                    sx={{ textTransform: "none" }}
                  >
                    Search
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Popper>
    </Box>
  );
});

export default SearchBar;
