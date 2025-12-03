import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListSubheader,
  Typography,
  Divider
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FilterDrawer = ({ open, onClose, categories, tags, filterOptions, onFilterChange }) => {
  const theme = useTheme();

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
    onFilterChange({ categories: [], tags: [] });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 360 },
          maxWidth: "100%",
          bgcolor: theme.palette.background.default,
          borderLeft: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" className="font-serif" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            Filters
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={handleResetFilters}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.secondary,
              "&:hover": { color: theme.palette.error.main, borderColor: theme.palette.error.main, bgcolor: theme.palette.error.light + "20" },
            }}
            title="Reset filters"
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.secondary,
              "&:hover": { bgcolor: theme.palette.action.hover, color: theme.palette.primary.main },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ overflow: "auto", flex: 1, p: 2 }}>
        {categories?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: theme.palette.primary.main, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Categories
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {categories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      size="small"
                      checked={filterOptions.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      sx={{ color: theme.palette.text.secondary, "&.Mui-checked": { color: theme.palette.primary.main } }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{category.name}</Typography>}
                  sx={{ ml: 0, mr: 0, "&:hover": { bgcolor: theme.palette.action.hover, borderRadius: 1 } }}
                />
              ))}
            </Box>
          </Box>
        )}

        {categories?.length > 0 && tags?.length > 0 && <Divider sx={{ my: 2 }} />}

        {tags?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: theme.palette.secondary.main, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Tags
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {tags.map((tag) => (
                <FormControlLabel
                  key={tag.id}
                  control={
                    <Checkbox
                      size="small"
                      checked={filterOptions.tags.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                      sx={{ color: theme.palette.text.secondary, "&.Mui-checked": { color: theme.palette.secondary.main } }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{tag.name}</Typography>}
                  sx={{ ml: 0, mr: 0, "&:hover": { bgcolor: theme.palette.action.hover, borderRadius: 1 } }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{
            py: 1.5,
            borderRadius: "8px",
            fontWeight: 700,
            textTransform: "none",
            bgcolor: theme.palette.primary.main,
            "&:hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          View Results
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
