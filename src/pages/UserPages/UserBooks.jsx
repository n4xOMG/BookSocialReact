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
  Grid,
  IconButton,
  InputAdornment,
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
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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
  const observer = useRef(null);

  const { categories: selectedCategories, tags: selectedTags, sortBy, sortOrder } = filterOptions;

  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategories.length || selectedTags.length);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleOpenModal = (type, data = null) => {
    setOpenModal({ type, data });
  };
  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilterChange = (newFilters) => {
    setFilterOptions((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleSortChange = (event) => {
    setFilterOptions((prev) => ({
      ...prev,
      sortBy: event.target.value,
    }));
  };

  const handleSortOrderChange = () => {
    setFilterOptions((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterOptions(createInitialFilters());
  };

  const toggleFilterDrawer = () => {
    setOpenFilterDrawer((prev) => !prev);
  };

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
    if (!tags.length) {
      dispatch(getTags());
    }
    if (!categories.length) {
      dispatch(getCategories());
    }
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
        if (!cancelled) {
          setIsListLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      cancelled = true;
    };
  }, [dispatch, user?.id, debouncedQuery, selectedCategories, selectedTags, sortBy, sortOrder]);

  useEffect(() => {
    if (!booksByAuthor.length) {
      setSelectedBookId(null);
      return;
    }

    if (!selectedBookId || !booksByAuthor.some((item) => item.id === selectedBookId)) {
      setSelectedBookId(booksByAuthor[0].id);
    }
  }, [booksByAuthor, selectedBookId]);

  const handleSelectBook = useCallback((id) => {
    setSelectedBookId(id);
  }, []);

  useEffect(() => {
    if (!selectedBookId) {
      dispatch(clearChapters());
      setIsDetailLoading(false);
      return;
    }

    let cancelled = false;

    const fetchDetails = async () => {
      setIsDetailLoading(true);
      try {
        await Promise.all([dispatch(getBookByIdAction(null, selectedBookId)), dispatch(manageChapterByBookId(selectedBookId))]);
      } catch (error) {
        console.error("Error loading book details:", error);
      } finally {
        if (!cancelled) {
          setIsDetailLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [dispatch, selectedBookId]);

  const getTagsByIds = (tagIds = []) => {
    if (!Array.isArray(tagIds)) {
      console.warn("Expected tagIds to be an array, but got:", tagIds);
      return [];
    }
    return tags.filter((tag) => tagIds.includes(tag.id));
  };

  const selectedTagChips = useMemo(() => tags.filter((tag) => selectedTags.includes(tag.id)), [tags, selectedTags]);

  const selectedCategoryChips = useMemo(
    () => categories.filter((category) => selectedCategories.includes(category.id)),
    [categories, selectedCategories]
  );

  const handleRemoveFilter = (type, id) => {
    if (type === "category") {
      setFilterOptions((prev) => ({
        ...prev,
        categories: prev.categories.filter((catId) => catId !== id),
      }));
    } else if (type === "tag") {
      setFilterOptions((prev) => ({
        ...prev,
        tags: prev.tags.filter((tagId) => tagId !== id),
      }));
    }
  };

  const isManga = useMemo(() => {
    const tagNames = (book?.tagNames || []).map((name) => name?.toLowerCase());
    if (tagNames.includes("manga")) {
      return true;
    }
    return getTagsByIds(book?.tagIds || []).some((tag) => tag.name.toLowerCase() === "manga");
  }, [book, tags]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overscrollBehavior: "contain",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"} style={{ width: "100%", height: "100%" }}>
          <Panel minSize={30} defaultSize={60}>
            <Box
              component={Paper}
              elevation={1}
              sx={{
                width: "100%",
                height: "100%",
                ...(isMobile && { minHeight: "50vh" }),
                borderRight: isMobile ? 0 : 1,
                borderColor: "divider",
                boxSizing: "border-box",
                px: 3,
                pt: 3,
                pb: 2,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 0,
                backdropFilter: "blur(0px)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  My Books
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => navigate("/author/dashboard")}>
                    Author Dashboard
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => navigate("/author/payout-settings")}>
                    Payout Settings
                  </Button>
                  <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/upload-book")}>
                    Add Book
                  </Button>
                </Box>
              </Box>

              {/* Search and Filter Bar */}
              <Box
                component={Paper}
                sx={{
                  mb: 2,
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Grid container spacing={1} alignItems="center" sx={{ p: 1 }}>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search books..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={handleClearSearch}>
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Tooltip title="Filter">
                      <IconButton size="small" onClick={toggleFilterDrawer}>
                        <FilterListIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={filterOptions.sortBy}
                        onChange={handleSortChange}
                        displayEmpty
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "10px",
                          },
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <Tooltip title={`Sort ${filterOptions.sortOrder === "asc" ? "ascending" : "descending"}`}>
                              <IconButton size="small" onClick={handleSortOrderChange} sx={{ mr: 0.5 }}>
                                <SortIcon
                                  fontSize="small"
                                  sx={{
                                    transform: filterOptions.sortOrder === "desc" ? "rotate(180deg)" : "none",
                                    transition: "transform 0.3s",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="title">Title</MenuItem>
                        <MenuItem value="uploadDate">Upload Date</MenuItem>
                        <MenuItem value="chapterCount">Chapter Count</MenuItem>
                        <MenuItem value="avgRating">Rating</MenuItem>
                        <MenuItem value="viewCount">Views</MenuItem>
                        <MenuItem value="favCount">Favorites</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Active Filters Display */}
              {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5, maxHeight: 60, overflow: "auto" }}>
                  {selectedCategoryChips.map((category) => (
                    <FilterChip
                      key={`category-${category.id}`}
                      label={category.name}
                      color="primary"
                      onDelete={() => handleRemoveFilter("category", category.id)}
                    />
                  ))}
                  {selectedTagChips.map((tag) => (
                    <FilterChip
                      key={`tag-${tag.id}`}
                      label={tag.name}
                      color="secondary"
                      onDelete={() => handleRemoveFilter("tag", tag.id)}
                    />
                  ))}
                </Box>
              )}
              <Box sx={{ flex: 1, overflow: "auto" }}>
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
                      onEditBook={(book) => handleOpenModal("editBook", book)}
                      onDeleteBook={(book) => handleOpenModal("deleteBook", book)}
                      lastBookElementRef={lastBookElementRef}
                    />
                    {loadingMore && (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    )}
                  </>
                ) : hasActiveFilters ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No books match your filter criteria
                    </Typography>
                    <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      You haven't created any books yet
                    </Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate("/upload-book")}>
                      Create Your First Book
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Panel>

          <PanelResizeHandle
            style={{
              width: isMobile ? "100%" : "8px",
              height: isMobile ? "8px" : "100%",
              background: "divider",
              cursor: isMobile ? "row-resize" : "col-resize",
              transition: "background-color 0.3s",
            }}
          />

          <Panel minSize={30} defaultSize={40}>
            {/* Rest of component remains the same */}
            <Box
              component={Paper}
              elevation={1}
              sx={{
                width: "100%",
                boxSizing: "border-box",
                height: isMobile ? "50vh" : "100%",
                px: 3,
                pt: 3,
                pb: 2,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 0,
                backdropFilter: "blur(0px)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  Chapters
                </Typography>
                {selectedBookId ? (
                  isManga ? (
                    <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal("addMangaChapter")}>
                      Add Manga Chapter
                    </Button>
                  ) : (
                    <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal("addNovelChapter")}>
                      Add Chapter
                    </Button>
                  )
                ) : null}
              </Box>
              <Box sx={{ mb: 1, justifyContent: "space-between", display: "flex", alignItems: "center" }}>
                <Typography variant="subTitle2" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  {book?.title || "Select a book to view chapters"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: "divider" }} />
              <Box sx={{ flex: 1, overflow: "hidden" }}>
                {isDetailLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <CircularProgress />
                  </Box>
                ) : !selectedBookId ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Typography variant="body1" color="text.secondary">
                      Select a book to view chapters
                    </Typography>
                  </Box>
                ) : chapters.length > 0 ? (
                  <UserBookChapterList
                    chapters={chapters}
                    onEditChapter={(chapter) => handleOpenModal("editChapter", chapter)}
                    onDeleteChapter={(chapter) => handleOpenModal("deleteChapter", chapter)}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No chapters added yet
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenModal(isManga ? "addMangaChapter" : "addNovelChapter")}
                    >
                      Add Your First Chapter
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Panel>
        </PanelGroup>
      </Box>

      <Suspense fallback={<CircularProgress />}>
        {openModal.type === "editBook" && (
          <EditBookDialog open={true} handleClose={handleCloseModal} currentBook={openModal.data} categories={categories} tags={tags} />
        )}
        {openModal.type === "deleteBook" && <DeleteBookModal open={true} onClose={handleCloseModal} deleteBook={openModal.data} />}
        {!isManga && openModal.type === "addNovelChapter" && (
          <AddChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} />
        )}
        {isManga && openModal.type === "addMangaChapter" && (
          <AddMangaChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} />
        )}
        {!isManga && openModal.type === "editChapter" && (
          <EditChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} chapterDetails={openModal.data} />
        )}
        {isManga && openModal.type === "editChapter" && (
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
