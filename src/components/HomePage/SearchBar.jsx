import React, { useState } from "react";
import { TextField, Autocomplete, Checkbox, Chip, Popover, Typography, Box } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

const SearchBar = ({ tags, categories, onSearch }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleTagChange = (event, values) => {
    setSelectedTags(values);
    onSearch({ tags: values, categories: selectedCategories });
  };

  const handleCategoryChange = (event, values) => {
    setSelectedCategories(values);
    onSearch({ tags: selectedTags, categories: values });
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
            Filter by Categories
          </Typography>
          <Autocomplete
            multiple
            options={categories}
            getOptionLabel={(option) => option.name}
            value={selectedCategories}
            onChange={handleCategoryChange}
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
            renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select Categories" />}
          />
          <Box style={chipContainerStyle}>
            {selectedTags.map((tag) => (
              <Chip key={tag.id} label={tag.name} />
            ))}
            {selectedCategories.map((category) => (
              <Chip key={category.id} label={category.name} />
            ))}
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default SearchBar;
