import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search as SearchIcon, FilterList as FilterListIcon } from "@mui/icons-material";
import SearchBar from "../../components/HomePage/SearchBar";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";
import { searchBookAction } from "../../redux/book/book.action";

const BookSearchResults = () => {
  // State variables for search parameters
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // State variables for filters and results
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [books, setBooks] = useState([]);

  // State variables for UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [fetchedCategories, fetchedTags] = await Promise.all([getCategories(), getTags()]);
        setCategories(fetchedCategories);
        setTags(fetchedTags);
      } catch (err) {
        console.error("Error fetching filters:", err);
        setError("Failed to load filters.");
      }
    };

    fetchFilters();
  }, []);

  // Handle search action
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchBookAction(title.trim(), categoryId || null, selectedTags.length > 0 ? selectedTags : null);
      setBooks(results);
    } catch (err) {
      console.error("Error searching books:", err);
      setError("Error occurred while searching for books.");
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  };

  // Handle tags change
  const handleTagsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    handleSearch();
  }, [categoryId, selectedTags]);

  return (
    <Box sx={{ padding: 4 }}>
      {/* Search Bar */}
      <SearchBar
        title={title}
        setTitle={setTitle}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        onSearch={handleSearch}
        categories={categories}
        tags={tags}
      />

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginTop: 2,
          marginBottom: 4,
        }}
      >
        {/* Category Filter */}
        <FormControl sx={{ minWidth: 200 }} variant="outlined">
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={categoryId}
            onChange={handleCategoryChange}
            label="Category"
            startAdornment={<FilterListIcon sx={{ marginRight: 1 }} />}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tags Filter */}
        <FormControl sx={{ minWidth: 300 }} variant="outlined">
          <InputLabel id="tags-filter-label">Tags</InputLabel>
          <Select
            labelId="tags-filter-label"
            multiple
            value={selectedTags}
            onChange={handleTagsChange}
            input={<OutlinedInput id="select-tags" label="Tags" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((id) => {
                  const tag = tags.find((t) => t.id === id);
                  return tag ? <Chip key={id} label={tag.name} /> : null;
                })}
              </Box>
            )}
            startAdornment={<FilterListIcon sx={{ marginRight: 1, marginTop: 1 }} />}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSearch} startIcon={<SearchIcon />} sx={{ height: 56 }}>
          Search
        </Button>
      </Box>

      <Box>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", marginY: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ marginY: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && books.length === 0 && !error && (
          <Alert severity="info" sx={{ marginY: 2 }}>
            No books found matching your criteria.
          </Alert>
        )}

        <Grid container spacing={4}>
          {books.map((book) => (
            <Grid item key={book.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                {book.bookCover && <CardMedia component="img" sx={{ height: 200 }} image={book.bookCover} alt={book.title} />}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Author: {book.authorName || "Unknown"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {book.categoryName || "N/A"}
                  </Typography>
                  <Box sx={{ marginTop: 1 }}>
                    {book.tagNames && book.tagNames.length > 0 && (
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {book.tagNames.map((tag) => (
                          <Chip key={tag} label={tag} size="small" color="primary" />
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default BookSearchResults;
