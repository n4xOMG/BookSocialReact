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
          background: (theme) => (theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.85)" : "rgba(248, 247, 244, 0.85)"),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderLeft: "1px solid",
          borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.2)" : "rgba(157, 80, 187, 0.15)"),
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FilterListIcon sx={{ mr: 1, color: "#9d50bb" }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Filters
          </Typography>
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={handleResetFilters}
            sx={{
              mr: 1,
              background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 107, 107, 0.15)" : "rgba(255, 107, 107, 0.1)"),
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 107, 107, 0.3)",
              color: "#ff6b6b",
              "&:hover": {
                background: "rgba(255, 107, 107, 0.25)",
              },
            }}
            title="Reset filters"
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"),
              backdropFilter: "blur(8px)",
              "&:hover": {
                background: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"),
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ overflow: "auto", flex: 1 }}>
        {categories?.length > 0 && (
          <List
            dense
            subheader={
              <ListSubheader
                sx={{
                  bgcolor: "transparent",
                  lineHeight: "2rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Categories
              </ListSubheader>
            }
          >
            <Box
              sx={{
                maxHeight: 200,
                overflow: "auto",
                pl: 2,
                "& .MuiCheckbox-root": {
                  color: (theme) => (theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.5)" : "rgba(157, 80, 187, 0.6)"),
                },
                "& .Mui-checked": {
                  color: "#9d50bb !important",
                },
              }}
            >
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
          <List
            dense
            subheader={
              <ListSubheader
                sx={{
                  bgcolor: "transparent",
                  lineHeight: "2rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #00c9a7, #56efca)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Tags
              </ListSubheader>
            }
          >
            <Box
              sx={{
                maxHeight: 300,
                overflow: "auto",
                pl: 2,
                "& .MuiCheckbox-root": {
                  color: (theme) => (theme.palette.mode === "dark" ? "rgba(0, 201, 167, 0.5)" : "rgba(0, 201, 167, 0.6)"),
                },
                "& .Mui-checked": {
                  color: "#00c9a7 !important",
                },
              }}
            >
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
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: "12px",
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            py: 1.25,
            fontSize: "1rem",
            boxShadow: "0 4px 16px rgba(157, 80, 187, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #b968c7, #9d50bb)",
              boxShadow: "0 6px 24px rgba(157, 80, 187, 0.5)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
