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
import { debounce } from "lodash";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddMangaChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/AddMangaChapterModal";
import AddChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/AddNovelChapterModal";
import DeleteBookModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/DeleteBookModal";
import DeleteChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/DeleteChapterModal";
import EditChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/EditChapterModal";
import EditMangaChapterModal from "../../components/AdminPage/Dashboard/BooksTab/ChapterModal/EditMangaChapterModal";
import EditBookDialog from "../../components/AdminPage/Dashboard/BooksTab/EditBookDialog";
import Sidebar from "../../components/HomePage/Sidebar";
import { BookList } from "../../components/UserBooks/BookList";
import { FilterChip } from "../../components/UserBooks/FilterChip";
import FilterDrawer from "../../components/UserBooks/FilterDrawer";
import { UserBookChapterList } from "../../components/UserBooks/UserBookChapterList";
import { getBookByIdAction, getBooksByAuthorAction } from "../../redux/book/book.action";
import { getCategories } from "../../redux/category/category.action";
import { clearChapters, manageChapterByBookId } from "../../redux/chapter/chapter.action";
import { getTags } from "../../redux/tag/tag.action";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const UserBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { booksByAuthor, booksByAuthorPage, booksByAuthorHasMore, book } = useSelector((store) => store.book);
  const { chapters } = useSelector((store) => store.chapter);
  const { user } = useSelector((store) => store.auth);
  const { tags } = useSelector((store) => store.tag);
  const { categories } = useSelector((store) => store.category);
  const [openModal, setOpenModal] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const observer = useRef();
  const PAGE_SIZE = 10;

  // New states for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    tags: [],
    sortBy: "title",
    sortOrder: "asc",
  });
  const [filteredBooks, setFilteredBooks] = useState([]);

  const handleOpenModal = (type, data = null) => {
    setLoading(false);
    setOpenModal({ type, data });
  };
  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilterOptions({
      ...filterOptions,
      ...newFilters,
    });
  };

  // Handle sort option changes
  const handleSortChange = (event) => {
    setFilterOptions({
      ...filterOptions,
      sortBy: event.target.value,
    });
  };

  // Handle sort direction change
  const handleSortOrderChange = () => {
    setFilterOptions({
      ...filterOptions,
      sortOrder: filterOptions.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  const toggleFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Last element ref for infinite scrolling
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && booksByAuthorHasMore) {
          loadMoreBooks();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, booksByAuthorHasMore]
  );

  // Load more books function
  const loadMoreBooks = async () => {
    if (!user?.id || !booksByAuthorHasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      await dispatch(getBooksByAuthorAction(user.id, booksByAuthorPage + 1, PAGE_SIZE, filterOptions));
    } catch (error) {
      console.error("Error loading more books:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Apply filters and sorting to books
  useEffect(() => {
    if (booksByAuthor.length === 0) return;

    let result = [...booksByAuthor];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) => book.title.toLowerCase().includes(query) || (book.description && book.description.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filterOptions.categories.length > 0) {
      result = result.filter((book) => filterOptions.categories.includes(book.categoryId));
    }

    // Apply tag filter
    if (filterOptions.tags.length > 0) {
      result = result.filter((book) => book.tagIds && book.tagIds.some((tagId) => filterOptions.tags.includes(tagId)));
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareResult = 0;

      switch (filterOptions.sortBy) {
        case "title":
          compareResult = a.title.localeCompare(b.title);
          break;
        case "uploadDate":
          compareResult = new Date(a.uploadDate) - new Date(b.uploadDate);
          break;
        case "chapterCount":
          compareResult = a.chapterCount - b.chapterCount;
          break;
        case "avgRating":
          compareResult = (a.avgRating || 0) - (b.avgRating || 0);
          break;
        case "viewCount":
          compareResult = a.viewCount - b.viewCount;
          break;
        case "favCount":
          compareResult = a.favCount - b.favCount;
          break;
        default:
          compareResult = a.title.localeCompare(b.title);
      }

      return filterOptions.sortOrder === "asc" ? compareResult : -compareResult;
    });

    setFilteredBooks(result);

    // If the currently selected book is not in filtered results and there are books after filtering,
    // select the first book from the filtered results
    if (result.length > 0 && !result.some((book) => book.id === selectedBookId)) {
      setSelectedBookId(result[0].id);
    }
  }, [booksByAuthor, searchQuery, filterOptions, selectedBookId]);

  useEffect(() => {
    dispatch(clearChapters());
  }, [dispatch]);

  useEffect(() => {
    const fetchBookInfo = async () => {
      setLoading(true);
      try {
        if (!tags || !categories) {
          await dispatch(getTags());
          await dispatch(getCategories());
        }
        // Use pagination when fetching initial books
        await dispatch(getBooksByAuthorAction(user?.id, 0, PAGE_SIZE, filterOptions));
      } catch (e) {
        console.log("Error trying to get all books by user: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookInfo();
  }, [dispatch, filterOptions]);

  // Reload books when filters change
  useEffect(() => {
    if (user?.id) {
      const reloadWithFilters = async () => {
        setLoading(true);
        try {
          // Reset pagination and get first page with new filters
          await dispatch(getBooksByAuthorAction(user.id, 0, PAGE_SIZE, filterOptions));
        } catch (e) {
          console.log("Error trying to filter books: ", e);
        } finally {
          setLoading(false);
        }
      };
      reloadWithFilters();
    }
  }, [filterOptions, dispatch, user?.id]);

  useEffect(() => {
    if (booksByAuthor.length > 0 && !selectedBookId) {
      setSelectedBookId(booksByAuthor[0].id);
      setFilteredBooks(booksByAuthor);
    }
  }, [booksByAuthor, selectedBookId]);

  const debouncedSetSelectedBookId = useCallback(
    debounce((id) => setSelectedBookId(id), 300),
    []
  );

  useEffect(() => {
    if (selectedBookId) {
      const fetchChapterById = async () => {
        setLoading(true);
        try {
          await dispatch(manageChapterByBookId(selectedBookId));
        } catch (e) {
          console.log("Error trying to get all chapters in manage book page: ", e);
        } finally {
          setLoading(false);
        }
      };
      const fetchBookInfo = async () => {
        setLoading(true);
        try {
          await dispatch(getBookByIdAction(null, selectedBookId));
        } catch (e) {
          console.log("Error trying to book by id in manage book page: ", e);
        } finally {
          setLoading(false);
        }
      };
      fetchBookInfo();
      fetchChapterById();
    }
  }, [selectedBookId, dispatch]);

  const getTagsByIds = (tagIds = []) => {
    if (!Array.isArray(tagIds)) {
      console.warn("Expected tagIds to be an array, but got:", tagIds);
      return [];
    }
    return tags.filter((tag) => tagIds.includes(tag.id));
  };

  // Get selected tag and category objects for displaying as filter chips
  const getSelectedTags = () => {
    return tags.filter((tag) => filterOptions.tags.includes(tag.id));
  };

  const getSelectedCategories = () => {
    return categories.filter((category) => filterOptions.categories.includes(category.id));
  };

  // Remove a filter chip
  const handleRemoveFilter = (type, id) => {
    if (type === "category") {
      setFilterOptions({
        ...filterOptions,
        categories: filterOptions.categories.filter((catId) => catId !== id),
      });
    } else if (type === "tag") {
      setFilterOptions({
        ...filterOptions,
        tags: filterOptions.tags.filter((tagId) => tagId !== id),
      });
    }
  };

  const isManga = getTagsByIds(book?.tagIds || []).some((tag) => tag.name.toLowerCase() === "manga");

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
                  {" "}
                  {/* Sửa lỗi ở đây */}
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
              {(filterOptions.categories.length > 0 || filterOptions.tags.length > 0) && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5, maxHeight: 60, overflow: "auto" }}>
                  {getSelectedCategories().map((category) => (
                    <FilterChip
                      key={`category-${category.id}`}
                      label={category.name}
                      color="primary"
                      onDelete={() => handleRemoveFilter("category", category.id)}
                    />
                  ))}
                  {getSelectedTags().map((tag) => (
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
                {loading && !filteredBooks.length ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <CircularProgress />
                  </Box>
                ) : filteredBooks.length > 0 ? (
                  <>
                    <BookList
                      books={filteredBooks}
                      selectedBookId={selectedBookId}
                      onSelectBook={debouncedSetSelectedBookId}
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
                ) : booksByAuthor.length > 0 ? (
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
                    <Button
                      variant="outlined"
                      startIcon={<ClearIcon />}
                      onClick={() => {
                        setSearchQuery("");
                        setFilterOptions({
                          categories: [],
                          tags: [],
                          sortBy: "title",
                          sortOrder: "asc",
                        });
                      }}
                    >
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
                {loading ? (
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

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default UserBooks;
