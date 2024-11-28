import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Autocomplete, Box, Button, Checkbox, Chip, Popover, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ tags, categories }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");

  const handleSearch = () => {
    const tagIds = selectedTags.map((tag) => tag.id);
    const categoryId = selectedCategory ? selectedCategory.id : null;
    console.log("Tag ids", tagIds);
    const params = new URLSearchParams();

    if (searchTitle) params.append("title", searchTitle);
    if (categoryId) params.append("categoryId", categoryId);
    if (tagIds && tagIds.length > 0) tagIds.forEach((id) => params.append("tagIds", id));
    navigate(`/search-results?${params}`);
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleTagChange = (event, values) => {
    setSelectedTags(values);
  };

  const handleCategoryChange = (event, value) => {
    setSelectedCategory(value);
  };

  const popoverContentStyle = {
    padding: 16,
    maxWidth: 300,
  };

  const chipContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  };

  return (
    <div>
      <TextField
        variant="outlined"
        label="Search"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        onClick={handleClick}
        fullWidth
        InputProps={{
          endAdornment: <CheckBoxOutlineBlankIcon />,
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box style={popoverContentStyle}>
          <Typography variant="h6">Filter by Tags</Typography>
          <Autocomplete
            multiple
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
                />
                {option.name}
              </li>
            )}
            renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select Tags" />}
          />
          <Typography variant="h6" style={{ marginTop: 16 }}>
            Filter by Category
          </Typography>
          <Autocomplete
            options={categories}
            getOptionLabel={(option) => option.name}
            value={selectedCategory}
            onChange={handleCategoryChange}
            renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select Category" />}
          />
          <Box style={chipContainerStyle}>
            {selectedTags.map((tag) => (
              <Chip key={tag.id} label={tag.name} />
            ))}
            {selectedCategory && <Chip key={selectedCategory.id} label={selectedCategory.name} />}
          </Box>
          <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mt: 2 }}>
            Search
          </Button>
        </Box>
      </Popover>
    </div>
  );
};

export default SearchBar;
