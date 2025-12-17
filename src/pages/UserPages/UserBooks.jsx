import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate } from "react-router-dom";

import AddMangaChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/AddMangaChapterModal";
import AddChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/AddNovelChapterModal";
import DeleteBookModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/DeleteBookModal";
import DeleteChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/DeleteChapterModal";
import EditChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/EditChapterModal";
import EditMangaChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/EditMangaChapterModal";
import EditBookDialog from "../../components/AdminPage/Dashboard/BooksTab/EditBookDialog";
import { BookList } from "../../components/UserBooks/BookList";
import { FilterChip } from "../../components/UserBooks/FilterChip";
import FilterDrawer from "../../components/UserBooks/FilterDrawer";
import { UserBookChapterList } from "../../components/UserBooks/UserBookChapterList";

import { getBookByIdAction, getBooksByAuthorAction } from "../../redux/book/book.action";
import { getCategories } from "../../redux/category/category.action";
import { clearChapters, manageChapterByBookId } from "../../redux/chapter/chapter.action";
import { getTags } from "../../redux/tag/tag.action";

const PAGE_SIZE = 10;
const createInitialFilters = () => ({
  categories: [],
  tags: [],
  sortBy: "title",
  sortOrder: "asc",
});

const UserBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { booksByAuthor, booksByAuthorPage, booksByAuthorHasMore, book } = useSelector((store) => store.book);
  const { chapters } = useSelector((store) => store.chapter);
  const { user } = useSelector((store) => store.auth);
  const { tags = [] } = useSelector((store) => store.tag);
  const { categories = [] } = useSelector((store) => store.category);

  const [openModal, setOpenModal] = useState({ type: null, data: null });
  const [isListLoading, setIsListLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [filterOptions, setFilterOptions] = useState(() => createInitialFilters());

  const [chapterSortBy, setChapterSortBy] = useState("uploadDate");
  const [chapterSortDir, setChapterSortDir] = useState("asc");
  const [chapterSortAnchorEl, setChapterSortAnchorEl] = useState(null);

  const observer = useRef(null);

  const { categories: selectedCategories, tags: selectedTags, sortBy, sortOrder } = filterOptions;
  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategories.length || selectedTags.length);

  // Debounce Search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleOpenModal = (type, data = null) => setOpenModal({ type, data });
  const handleCloseModal = () => setOpenModal({ type: null, data: null });
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleClearSearch = () => setSearchQuery("");
  
  const handleViewChapter = (chapter) => {
    const bookId = chapter.bookId || selectedBookId; 
    navigate(`/books/${bookId}/chapters/${chapter.id}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilterOptions((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (event) => {
    setFilterOptions((prev) => ({ ...prev, sortBy: event.target.value }));
  };

  const handleSortOrderChange = () => {
    setFilterOptions((prev) => ({ ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterOptions(createInitialFilters());
  };

  const toggleFilterDrawer = () => setOpenFilterDrawer((prev) => !prev);

  const handleOpenChapterSort = (event) => setChapterSortAnchorEl(event.currentTarget);
  const handleCloseChapterSort = () => setChapterSortAnchorEl(null);
  const handleChapterSortChange = (sortBy, sortDir) => {
    setChapterSortBy(sortBy);
    setChapterSortDir(sortDir);
    handleCloseChapterSort();
  };

  // Data Fetching - Load More Books
  const loadMoreBooks = useCallback(async () => {
    if (!user?.id || !booksByAuthorHasMore || loadingMore || isListLoading) return;
    try {
      setLoadingMore(true);
      await dispatch(
        getBooksByAuthorAction({
          query: debouncedQuery,
          page: booksByAuthorPage + 1,
          size: PAGE_SIZE,
          categories: selectedCategories,
          tags: selectedTags,
          sortBy,
          sortDir: sortOrder,
        })
      );
    } catch (error) {
      console.error("Error loading more books:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [
    dispatch,
    user?.id,
    booksByAuthorHasMore,
    booksByAuthorPage,
    loadingMore,
    isListLoading,
    debouncedQuery,
    selectedCategories,
    selectedTags,
    sortBy,
    sortOrder,
  ]);

  const lastBookElementRef = useCallback(
    (node) => {
      if (isListLoading || loadingMore || !booksByAuthorHasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && booksByAuthorHasMore) {
          loadMoreBooks();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isListLoading, loadingMore, booksByAuthorHasMore, loadMoreBooks]
  );

  useEffect(() => {
    dispatch(clearChapters());
  }, [dispatch]);

  useEffect(() => {
    if (!tags.length) dispatch(getTags());
    if (!categories.length) dispatch(getCategories());
  }, [dispatch, tags.length, categories.length]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    const fetchBooks = async () => {
      setIsListLoading(true);
      try {
        await dispatch(
          getBooksByAuthorAction({
            query: debouncedQuery,
            page: 0,
            size: PAGE_SIZE,
            categories: selectedCategories,
            tags: selectedTags,
            sortBy,
            sortDir: sortOrder,
          })
        );
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        if (!cancelled) setIsListLoading(false);
      }
    };
    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, [dispatch, user?.id, debouncedQuery, selectedCategories, selectedTags, sortBy, sortOrder]);

  // Auto-select first book
  useEffect(() => {
    if (!booksByAuthor.length) {
      setSelectedBookId(null);
      return;
    }
    if (!selectedBookId || !booksByAuthor.some((item) => item.id === selectedBookId)) {
      setSelectedBookId(booksByAuthor[0].id);
    }
  }, [booksByAuthor, selectedBookId]);

  const handleSelectBook = useCallback((id) => setSelectedBookId(id), []);

  // Fetch Book Details & Chapters
  useEffect(() => {
    if (!selectedBookId) {
      dispatch(clearChapters());
      setIsDetailLoading(false);
      return;
    }

    // Fetch Book Details
    dispatch(getBookByIdAction(null, selectedBookId));
  }, [dispatch, selectedBookId]);

  // Fetch Chapters when book or sort changes
  useEffect(() => {
    if (!selectedBookId) return;

    let cancelled = false;
    const fetchChapters = async () => {
      setIsDetailLoading(true);
      try {
        await dispatch(manageChapterByBookId(selectedBookId, chapterSortBy, chapterSortDir));
      } catch (error) {
        console.error("Error loading chapters:", error);
      } finally {
        if (!cancelled) setIsDetailLoading(false);
      }
    };
    fetchChapters();
    return () => {
      cancelled = true;
    };
  }, [dispatch, selectedBookId, chapterSortBy, chapterSortDir]);

  // Helpers
  const selectedTagChips = useMemo(() => tags.filter((tag) => selectedTags.includes(tag.id)), [tags, selectedTags]);
  const selectedCategoryChips = useMemo(
    () => categories.filter((category) => selectedCategories.includes(category.id)),
    [categories, selectedCategories]
  );

  const handleRemoveFilter = (type, id) => {
    if (type === "category") {
      setFilterOptions((prev) => ({ ...prev, categories: prev.categories.filter((catId) => catId !== id) }));
    } else if (type === "tag") {
      setFilterOptions((prev) => ({ ...prev, tags: prev.tags.filter((tagId) => tagId !== id) }));
    }
  };

  // Get the currently selected book from the list (more reliable than the separate book state)
  const selectedBook = useMemo(() => {
    return booksByAuthor.find((b) => b.id === selectedBookId) || null;
  }, [booksByAuthor, selectedBookId]);

  // Determine book type by category
  const isImageDominant = useMemo(() => {
    if (!selectedBook?.categoryName) return false;

    const categoryName = selectedBook.categoryName.toLowerCase();
    return categoryName.includes("image");
  }, [selectedBook?.categoryName]);

  // Styles
  const panelStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    backgroundColor: theme.palette.background.default,
  };

  const headerStyle = {
    p: 3,
    pb: 2,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: theme.palette.background.default }}>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", width: "100%" }}>
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"} style={{ width: "100%", height: "100%" }}>
          {/* LEFT PANEL: BOOK LIST */}
          <Panel minSize={30} defaultSize={40} style={panelStyle}>
            <Box sx={headerStyle}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="h4"
                  className="font-serif"
                  sx={{ fontWeight: 800, color: theme.palette.text.primary, letterSpacing: "-0.02em" }}
                >
                  My Books
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Dashboard">
                    <Button variant="text" onClick={() => navigate("/author/dashboard")} sx={{ color: theme.palette.text.secondary }}>
                      Dashboard
                    </Button>
                  </Tooltip>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/upload-book")}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      bgcolor: theme.palette.primary.main,
                      "&:hover": { bgcolor: theme.palette.primary.dark },
                    }}
                  >
                    New Book
                  </Button>
                </Box>
              </Box>

              {/* Search & Filter */}
              <Paper
                elevation={0}
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "12px",
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <TextField
                  sx={{ ml: 1, flex: 1, "& fieldset": { border: "none" } }}
                  placeholder="Search your library..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClearSearch}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Tooltip title="Filter">
                  <IconButton color={hasActiveFilters ? "primary" : "default"} sx={{ p: "10px" }} onClick={toggleFilterDrawer}>
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
                <FormControl size="small" sx={{ minWidth: 120, ml: 1 }}>
                  <Select
                    value={filterOptions.sortBy}
                    onChange={handleSortChange}
                    displayEmpty
                    variant="standard"
                    disableUnderline
                    sx={{ fontSize: "0.875rem", fontWeight: 500 }}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton size="small" onClick={handleSortOrderChange}>
                          <SortIcon
                            fontSize="small"
                            sx={{ transform: filterOptions.sortOrder === "desc" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="uploadDate">Date</MenuItem>
                    <MenuItem value="chapterCount">Chapters</MenuItem>
                    <MenuItem value="avgRating">Rating</MenuItem>
                    <MenuItem value="viewCount">Views</MenuItem>
                  </Select>
                </FormControl>
              </Paper>

              {/* Active Filters */}
              {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: 60, overflow: "auto" }}>
                  {selectedCategoryChips.map((c) => (
                    <FilterChip key={`c-${c.id}`} label={c.name} onDelete={() => handleRemoveFilter("category", c.id)} />
                  ))}
                  {selectedTagChips.map((t) => (
                    <FilterChip key={`t-${t.id}`} label={t.name} color="secondary" onDelete={() => handleRemoveFilter("tag", t.id)} />
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", p: 0 }}>
              {isListLoading && !booksByAuthor.length ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress />
                </Box>
              ) : booksByAuthor.length > 0 ? (
                <>
                  <BookList
                    books={booksByAuthor}
                    selectedBookId={selectedBookId}
                    onSelectBook={handleSelectBook}
                    onEditBook={(b) => handleOpenModal("editBook", b)}
                    onDeleteBook={(b) => handleOpenModal("deleteBook", b)}
                    lastBookElementRef={lastBookElementRef}
                  />
                  {loadingMore && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: 2,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    {hasActiveFilters ? "No books match your filters" : "Your library is empty"}
                  </Typography>
                  <Button variant="outlined" onClick={hasActiveFilters ? handleClearFilters : () => navigate("/upload-book")}>
                    {hasActiveFilters ? "Clear Filters" : "Create First Book"}
                  </Button>
                </Box>
              )}
            </Box>
          </Panel>

          <PanelResizeHandle
            style={{
              width: isMobile ? "100%" : "2px",
              height: isMobile ? "2px" : "100%",
              backgroundColor: theme.palette.divider,
              cursor: isMobile ? "row-resize" : "col-resize",
              transition: "background-color 0.2s",
              zIndex: 10,
            }}
          />

          {/* RIGHT PANEL: CHAPTERS */}
          <Panel minSize={30} defaultSize={60} style={panelStyle}>
            <Box sx={{ ...headerStyle, borderBottom: "none", pb: 0, background: theme.palette.background.paper }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" className="font-serif" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  Table of Contents
                </Typography>
                {selectedBookId && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Sort Chapters">
                      <IconButton onClick={handleOpenChapterSort} size="small">
                        <SortIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={chapterSortAnchorEl}
                      open={Boolean(chapterSortAnchorEl)}
                      onClose={handleCloseChapterSort}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      <MenuItem onClick={() => handleChapterSortChange("uploadDate", "asc")}>Oldest First</MenuItem>
                      <MenuItem onClick={() => handleChapterSortChange("uploadDate", "desc")}>Newest First</MenuItem>
                      <MenuItem onClick={() => handleChapterSortChange("chapterNum", "asc")}>Chapter Number (Asc)</MenuItem>
                      <MenuItem onClick={() => handleChapterSortChange("chapterNum", "desc")}>Chapter Number (Desc)</MenuItem>
                      <MenuItem onClick={() => handleChapterSortChange("price", "asc")}>Price (Low to High)</MenuItem>
                      <MenuItem onClick={() => handleChapterSortChange("price", "desc")}>Price (High to Low)</MenuItem>
                    </Menu>

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenModal(isImageDominant ? "addMangaChapter" : "addNovelChapter")}
                      color="secondary"
                      sx={{ borderRadius: "8px", textTransform: "none" }}
                    >
                      Add Chapter
                    </Button>
                  </Box>
                )}
              </Box>
              {selectedBookId && (
                <Box sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: "12px", mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    {book?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
                  </Typography>
                </Box>
              )}
            </Box>
            <Divider />
            <Box sx={{ flex: 1, overflowY: "auto", bgcolor: theme.palette.background.paper }}>
              {isDetailLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress />
                </Box>
              ) : !selectedBookId ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography>Select a book to view chapters</Typography>
                </Box>
              ) : chapters.length > 0 ? (
                <UserBookChapterList
                  chapters={chapters}
                      onViewChapter={handleViewChapter}
                  onEditChapter={(c) => handleOpenModal("editChapter", c)}
                  onDeleteChapter={(c) => handleOpenModal("deleteChapter", c)}
                />
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 2 }}
                >
                  <Typography color="text.secondary">No chapters yet</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal(isImageDominant ? "addMangaChapter" : "addNovelChapter")}
                  >
                    Add Chapter
                  </Button>
                </Box>
              )}
            </Box>
          </Panel>
        </PanelGroup>
      </Box>

      {/* Modals */}
      <Suspense fallback={<CircularProgress />}>
        {openModal.type === "editBook" && (
          <EditBookDialog open={true} handleClose={handleCloseModal} currentBook={openModal.data} categories={categories} tags={tags} />
        )}
        {openModal.type === "deleteBook" && <DeleteBookModal open={true} onClose={handleCloseModal} deleteBook={openModal.data} />}
        {!isImageDominant && openModal.type === "addNovelChapter" && (
          <AddChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} />
        )}
        {isImageDominant && openModal.type === "addMangaChapter" && (
          <AddMangaChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} />
        )}
        {!isImageDominant && openModal.type === "editChapter" && (
          <EditChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} chapterDetails={openModal.data} />
        )}
        {isImageDominant && openModal.type === "editChapter" && (
          <EditMangaChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} chapterDetails={openModal.data} />
        )}
        {openModal.type === "deleteChapter" && (
          <DeleteChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} deleteChapter={openModal.data} />
        )}
      </Suspense>

      <FilterDrawer
        open={openFilterDrawer}
        onClose={toggleFilterDrawer}
        categories={categories}
        tags={tags}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isDetailLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default UserBooks;
