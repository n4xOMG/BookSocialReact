import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchBookAction } from "../../redux/book/book.action";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";
import { BookGrid } from "../../components/HomePage/BookGrid";

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_SORT = "id";

const parseParamsToFilters = (params) => {
  const tagIds = params
    .getAll("tagIds")
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id));
  const size = Number(params.get("size"));
  const page = Number(params.get("page"));

  return {
    title: params.get("title") || "",
    categoryId: params.get("categoryId") || "",
    tagIds,
    sortBy: params.get("sortBy") || DEFAULT_SORT,
    size: !Number.isNaN(size) && size > 0 ? size : DEFAULT_PAGE_SIZE,
    page: !Number.isNaN(page) && page >= 0 ? page : 0,
  };
};

const buildParamsFromFilters = (state) => {
  const params = new URLSearchParams();
  const title = state.title?.trim();
  if (title) params.set("title", title);
  if (state.categoryId) params.set("categoryId", state.categoryId);
  if (state.tagIds?.length) {
    state.tagIds.forEach((id) => params.append("tagIds", id));
  }
  params.set("page", String(state.page ?? 0));
  params.set("size", String(state.size || DEFAULT_PAGE_SIZE));
  params.set("sortBy", state.sortBy || DEFAULT_SORT);
  return params;
};

const BookSearchResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories = [] } = useSelector((state) => state.category);
  const { tags = [] } = useSelector((state) => state.tag);
  const { searchResults, searchPageInfo, error } = useSelector((state) => state.book);

  const [filters, setFilters] = useState(() => parseParamsToFilters(searchParams));
  const [searching, setSearching] = useState(false);

  const searchParamsKey = searchParams.toString();
  const queryFilters = useMemo(() => parseParamsToFilters(searchParams), [searchParamsKey]);

  const selectedCategory = useMemo(() => {
    if (!filters.categoryId) return null;
    return categories.find((category) => String(category.id) === String(filters.categoryId)) || null;
  }, [categories, filters.categoryId]);

  const selectedTagSet = useMemo(() => new Set(filters.tagIds?.map((id) => String(id)) || []), [filters.tagIds]);
  const selectedTags = useMemo(() => tags.filter((tag) => selectedTagSet.has(String(tag.id))), [tags, selectedTagSet]);

  const tagNameMap = useMemo(() => {
    const map = new Map();
    tags.forEach((tag) => map.set(String(tag.id), tag.name));
    return map;
  }, [tags]);

  useEffect(() => {
    setFilters(queryFilters);
  }, [queryFilters]);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getTags());
  }, [dispatch]);

  useEffect(() => {
    const paramsWithDefaults = new URLSearchParams(searchParams);
    let mutated = false;
    if (!searchParams.get("page")) {
      paramsWithDefaults.set("page", "0");
      mutated = true;
    }
    if (!searchParams.get("size")) {
      paramsWithDefaults.set("size", DEFAULT_PAGE_SIZE.toString());
      mutated = true;
    }
    if (!searchParams.get("sortBy")) {
      paramsWithDefaults.set("sortBy", DEFAULT_SORT);
      mutated = true;
    }
    if (mutated) {
      setSearchParams(paramsWithDefaults, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    let ignore = false;
    const paramsForRequest = new URLSearchParams(searchParams);
    const fetchResults = async () => {
      setSearching(true);
      try {
        await dispatch(searchBookAction(paramsForRequest));
      } finally {
        if (!ignore) {
          setSearching(false);
        }
      }
    };

    fetchResults();

    return () => {
      ignore = true;
    };
  }, [dispatch, searchParamsKey]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "size" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (event, value) => {
    setFilters((prev) => ({ ...prev, categoryId: value?.id ? String(value.id) : "" }));
  };

  const handleTagChange = (event, values) => {
    setFilters((prev) => ({ ...prev, tagIds: values.map((tag) => tag.id) }));
  };

  const applyFilters = () => {
    const params = buildParamsFromFilters({ ...filters, page: 0 });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const resetState = {
      title: "",
      categoryId: "",
      tagIds: [],
      sortBy: DEFAULT_SORT,
      size: DEFAULT_PAGE_SIZE,
      page: 0,
    };
    setFilters(resetState);
    setSearchParams(buildParamsFromFilters(resetState));
  };

  const handlePageChange = (event, value) => {
    const nextPage = value - 1;
    const params = buildParamsFromFilters({ ...queryFilters, page: nextPage });
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const books = searchResults || [];
  const totalPages = searchPageInfo?.totalPages ?? (books.length ? 1 : 0);
  const currentPage = searchPageInfo?.page ?? queryFilters.page ?? 0;
  const totalResults = searchPageInfo?.totalElements ?? books.length;
  const showEmptyState = !searching && !error && books.length === 0;

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const getCategoryName = (book) => {
    if (book.categoryName) return book.categoryName;
    const match = categories.find((category) => category.id === book.categoryId);
    return match?.name || "N/A";
  };

  const getTagLabels = (book) => {
    if (book.tagNames?.length) return book.tagNames;
    if (!book.tagIds?.length) return [];
    return book.tagIds.map((tagId) => tagNameMap.get(String(tagId))).filter(Boolean);
  };

  const sortOptions = [
    { value: "id", label: "Recently added" },
    { value: "title", label: "Title" },
    { value: "viewCount", label: "Most viewed" },
    { value: "uploadDate", label: "Latest updated" },
  ];
  const pageSizeOptions = [6, 12, 24, 36];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 2, md: 4 }, px: { xs: 2, md: 5 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ position: { md: "sticky" }, top: { md: 96 }, boxShadow: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Filter books</Typography>
                <TextField label="Title" name="title" value={filters.title} onChange={handleInputChange} size="small" />

                <Autocomplete
                  options={categories}
                  getOptionLabel={(option) => option?.name || ""}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  renderInput={(params) => <TextField {...params} label="Category" size="small" />}
                />

                <Autocomplete
                  multiple
                  options={tags}
                  getOptionLabel={(option) => option?.name || ""}
                  value={selectedTags}
                  onChange={handleTagChange}
                  renderInput={(params) => <TextField {...params} label="Tags" size="small" placeholder="Select tags" />}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip label={option.name} size="small" {...getTagProps({ index })} />)
                  }
                />

                <TextField select label="Sort by" name="sortBy" value={filters.sortBy} onChange={handleInputChange} size="small">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField select label="Results per page" name="size" value={filters.size} onChange={handleInputChange} size="small">
                  {pageSizeOptions.map((sizeOption) => (
                    <MenuItem key={sizeOption} value={sizeOption}>
                      {sizeOption}
                    </MenuItem>
                  ))}
                </TextField>

                <Divider />

                <Stack direction="row" spacing={1}>
                  <Button variant="contained" size="small" onClick={applyFilters} fullWidth>
                    Apply
                  </Button>
                  <Button variant="outlined" size="small" onClick={clearFilters} fullWidth>
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} justifyContent="space-between">
              <Box>
                <Typography variant="h5">Search results</Typography>
                <Typography variant="body2" color="text.secondary">
                  {searching ? "Searching for books..." : `Showing ${totalResults} result${totalResults === 1 ? "" : "s"}`}
                </Typography>
              </Box>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            {searching && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {showEmptyState && <Alert severity="info">No books found matching your criteria.</Alert>}

            {!searching && books.length > 0 && (
                <BookGrid 
                    books={books}
                    onBookClick={handleBookClick}
                    categories={categories} // Truyền categories
                    tags={tags}             // Truyền tags
                />
            )}

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <Pagination count={totalPages} page={currentPage + 1} onChange={handlePageChange} color="primary" shape="rounded" />
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookSearchResults;
