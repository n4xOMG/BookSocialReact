import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";

export default function CategoriesAndTagsStep({ bookInfo, setBookInfo }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
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
    setBookInfo((prev) => ({ ...prev, tags: newTags }));
  };

  const handleDeleteTag = (tagToDelete) => () => {
    const newTags = bookInfo.tags.filter((tag) => tag.id !== tagToDelete.id);
    setBookInfo((prev) => ({ ...prev, tags: newTags }));
  };

  const glassSelectStyle = {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(157, 80, 187, 0.5)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9d50bb",
      borderWidth: "2px",
    },
  };

  const labelStyle = {
    "&.Mui-focused": {
      color: "#9d50bb",
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="category-label" sx={labelStyle}>
          Category
        </InputLabel>
        <Select
          labelId="category-label"
          value={bookInfo.category}
          onChange={(event) => setBookInfo({ ...bookInfo, category: event.target.value })}
          input={<OutlinedInput label="Category" />}
          disabled={categoriesLoading}
          renderValue={(selected) => <Typography>{selected ? selected.name : ""}</Typography>}
          sx={glassSelectStyle}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="tags-label" sx={labelStyle}>
          Tags (Optional)
        </InputLabel>
        <Select
          labelId="tags-label"
          multiple
          value={bookInfo.tags}
          onChange={handleTagChange}
          input={<OutlinedInput label="Tags (Optional)" />}
          disabled={tagsLoading}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, rgba(157, 80, 187, 0.8), rgba(110, 72, 170, 0.8))",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          )}
          sx={glassSelectStyle}
        >
          {tagsLoading ? (
            <MenuItem disabled>
              <CircularProgress size={24} sx={{ color: "#9d50bb" }} />
            </MenuItem>
          ) : tagsError ? (
            <MenuItem disabled>
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

      {bookInfo.tags.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            p: 2,
            backgroundColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.05)" : "rgba(157, 80, 187, 0.03)",
            borderRadius: "12px",
            border: `1px solid ${theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.2)" : "rgba(157, 80, 187, 0.15)"}`,
          }}
        >
          {bookInfo.tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              onDelete={handleDeleteTag(tag)}
              sx={{
                background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                color: "#fff",
                fontWeight: 600,
                "& .MuiChip-deleteIcon": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    color: "#fff",
                  },
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
