import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const FilterDrawer = ({ open, onClose, categories, tags, filterOptions, onFilterChange }) => {
  const handleCategoryChange = (categoryId) => {
    const currentCategories = [...filterOptions.categories];
    const index = currentCategories.indexOf(categoryId);

    if (index === -1) {
      currentCategories.push(categoryId);
    } else {
      currentCategories.splice(index, 1);
    }

    onFilterChange({ categories: currentCategories });
  };

  const handleTagChange = (tagId) => {
    const currentTags = [...filterOptions.tags];
    const index = currentTags.indexOf(tagId);

    if (index === -1) {
      currentTags.push(tagId);
    } else {
      currentTags.splice(index, 1);
    }

    onFilterChange({ tags: currentTags });
  };

  const handleResetFilters = () => {
    onFilterChange({
      categories: [],
      tags: [],
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: {
            xs: "100%",
            sm: 320,
          },
          maxWidth: "100%",
          p: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FilterListIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Box>
          <IconButton size="small" onClick={handleResetFilters} sx={{ mr: 1 }} title="Reset filters">
            <RestartAltIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ overflow: "auto", flex: 1 }}>
        {categories?.length > 0 && (
          <List dense subheader={<ListSubheader sx={{ bgcolor: "background.paper", lineHeight: "2rem" }}>Categories</ListSubheader>}>
            <Box sx={{ maxHeight: 200, overflow: "auto", pl: 2 }}>
              <FormGroup>
                {categories.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        size="small"
                        checked={filterOptions.categories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                      />
                    }
                    label={<Typography variant="body2">{category.name}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </List>
        )}

        {tags?.length > 0 && (
          <List dense subheader={<ListSubheader sx={{ bgcolor: "background.paper", lineHeight: "2rem" }}>Tags</ListSubheader>}>
            <Box sx={{ maxHeight: 300, overflow: "auto", pl: 2 }}>
              <FormGroup>
                {tags.map((tag) => (
                  <FormControlLabel
                    key={tag.id}
                    control={
                      <Checkbox size="small" checked={filterOptions.tags.includes(tag.id)} onChange={() => handleTagChange(tag.id)} />
                    }
                    label={<Typography variant="body2">{tag.name}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </List>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
