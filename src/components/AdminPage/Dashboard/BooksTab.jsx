import {
  Alert,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBookAction,
  editBookAction,
  getAdminBooksAction,
  getBookCountAction,
  getFeaturedBooks,
  getTrendingBooks,
  setEditorChoice,
} from "../../../redux/book/book.action";
import { fetchBestBooks, fetchContentAnalytics } from "../../../redux/admin/admin.action";
import { getCategories } from "../../../redux/category/category.action";
import { getTags } from "../../../redux/tag/tag.action";
import UploadToCloudinary from "../../../utils/uploadToCloudinary";
import LoadingSpinner from "../../LoadingSpinner";
import BooksFilter from "./BooksTab/BooksFilter";
import BooksTable from "./BooksTab/BooksTable";
import EditBookDialog from "./BooksTab/EditBookDialog";
import ManageChaptersDialog from "./BooksTab/ManageChaptersDialog";
import BestBooksTable from "./Analytics/BestBooksTable";
import PopularChaptersTable from "./Analytics/PopularChaptersTable";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LanguageIcon from "@mui/icons-material/Language";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme } from "@emotion/react";

const BooksTab = () => {
  const dispatch = useDispatch();
  const { 
    books, 
    adminBooks,
    adminTotalBooks,
    bookCount, 
    featuredBooks, 
    trendingBooks, 
    loading: booksLoading, 
    error: booksError 
  } = useSelector((state) => state.book);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.category);
  const { tags, loading: tagsLoading, error: tagsError } = useSelector((state) => state.tag);
  const { bestBooks, contentAnalytics } = useSelector((state) => state.admin);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filters, setFilters] = useState({
    category: "",
    tag: "",
    status: "",
    title: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Manage chapters dialog state
  const [manageChaptersOpen, setManageChaptersOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Language distribution calculation
  const [languageStats, setLanguageStats] = useState({});

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        setRefreshing(true);
        await Promise.all([
          dispatch(getAdminBooksAction(page, rowsPerPage, filters)),
          dispatch(getBookCountAction()),
          dispatch(getCategories()),
          dispatch(getTags()),
          dispatch(getFeaturedBooks()),
          dispatch(getTrendingBooks()),
          dispatch(fetchBestBooks()),
          dispatch(fetchContentAnalytics()),
        ]);
        setRefreshing(false);
      } catch (e) {
        console.log(e);
        setRefreshing(false);
      }
    };
    fetchBooksData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Initial load

  // Fetch when page/filters change
  useEffect(() => {
    dispatch(getAdminBooksAction(page, rowsPerPage, filters));
  }, [dispatch, page, rowsPerPage, filters]);

  // Calculate language distribution when books change (using all books metric if available, else current page)
  useEffect(() => {
    if (adminBooks && adminBooks.length > 0) {
      const langCount = adminBooks.reduce((acc, book) => {
        const lang = book.language || "Unknown";
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {});
      setLanguageStats(langCount);
    }
  }, [adminBooks]);

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(getAdminBooksAction(page, rowsPerPage, filters)),
        dispatch(getBookCountAction()),
        dispatch(getFeaturedBooks()),
        dispatch(getTrendingBooks()),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const openDeleteDialog = (id) => {
    setBookToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      try {
        await dispatch(deleteBookAction(bookToDelete));
        dispatch(getAdminBooksAction(page, rowsPerPage, filters));
        await dispatch(getBookCountAction());
        setDeleteDialogOpen(false);
        setBookToDelete(null);
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleToggleIsSuggested = async (id, book) => {
    try {
      await dispatch(setEditorChoice(id, book));
      // Refresh the books data to show the updated state
      dispatch(getAdminBooksAction(page, rowsPerPage, filters));
      await dispatch(getFeaturedBooks());
    } catch (error) {
      console.error("Error toggling isSuggested status:", error);
    }
  };

  const handleEditOpen = (book) => {
    setCurrentBook(book);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setCurrentBook(null);
    setOpenEdit(false);
  };

  const handleEditSubmit = async () => {
    try {
      setIsSubmitting(true);
      let imageUrl = currentBook.bookCover;
      if (currentBook.coverFile) {
        imageUrl = await UploadToCloudinary(currentBook.coverFile, "books");
      }
      // Prepare the updated book data with categoryIds and tagIds
      const updatedBookData = {
        ...currentBook,
        bookCover: imageUrl,
        categoryId: currentBook.categoryId,
        tagIds: currentBook.tagIds,
      };

      await dispatch(editBookAction(currentBook.id, updatedBookData));
      // Refresh books data
      dispatch(getAdminBooksAction(page, rowsPerPage, filters));

      handleEditClose();
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(0); // Reset to first page on filter change
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // We no longer slice locally. adminBooks should only contain the current page.
  const isLoading = booksLoading || categoriesLoading || tagsLoading;

  const getCategoryById = (categoryId) => {
    return categories.find((category) => categoryId === category.id);
  };

  const getTagsByIds = (tagIds) => {
    return tags.filter((tag) => tagIds?.includes(tag.id));
  };

  // Handler to open Manage Chapters Dialog
  const handleManageChapters = (book) => {
    setSelectedBook(book);
    setManageChaptersOpen(true);
  };

  const handleManageChaptersClose = () => {
    setSelectedBook(null);
    setManageChaptersOpen(false);
  };

  // Stats cards data
  const statsCards = [
    {
      title: "Total Books",
      value: bookCount || books.length,
      icon: <LibraryBooksIcon fontSize="large" color="primary" />,
      color: "#e3f2fd",
    },
    {
      title: "Featured Books",
      value: featuredBooks?.length || 0,
      icon: <StarIcon fontSize="large" color="warning" />,
      color: "#fff8e1",
    },
    {
      title: "Trending Books",
      value: trendingBooks?.length || 0,
      icon: <TrendingUpIcon fontSize="large" color="success" />,
      color: "#e8f5e9",
    },
    {
      title: "Languages",
      value: Object.keys(languageStats).length,
      icon: <LanguageIcon fontSize="large" color="info" />,
      color: "#e0f7fa",
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Books Management
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={handleRefreshData} disabled={refreshing}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                bgcolor: stat.color,
                p: 2,
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="medium">
                    {stat.value}
                  </Typography>
                </Box>
                {stat.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Error Alerts */}
      {booksError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading books: {booksError}
        </Alert>
      )}
      {categoriesError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading categories: {categoriesError}
        </Alert>
      )}
      {tagsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading tags: {tagsError}
        </Alert>
      )}

      {/* Analytics Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Performance Insights
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          <Box>
            <BestBooksTable books={bestBooks} />
          </Box>
          <Box>
            <PopularChaptersTable chapters={contentAnalytics?.popularChapters || []} />
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <BooksFilter filters={filters} categories={categories} tags={tags} handleFilterChange={handleFilterChange} isDisabled={isLoading} />
      </Paper>

      {/* Loading Indicator */}
      {isLoading && <LoadingSpinner />}

      {/* Books Table or No Books Message */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Books List
        </Typography>

        {!isLoading && adminBooks.length === 0 ? (
          <Alert severity="info">No books match your filters.</Alert>
        ) : (
          <BooksTable
            books={adminBooks.map((book) => ({
              ...book,
              category: getCategoryById(book.categoryId),
              tags: getTagsByIds(book.tagIds),
            }))}
            loading={isLoading}
            page={page}
            rowsPerPage={rowsPerPage}
            totalBooks={adminTotalBooks}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleEditOpen={handleEditOpen}
            handleDelete={openDeleteDialog}
            handleToggleIsSuggested={handleToggleIsSuggested}
            handleManageChapters={handleManageChapters}
            isMobile={isMobile}
          />
        )}
      </Paper>

      {/* Edit Book Dialog */}
      {currentBook && (
        <EditBookDialog
          open={openEdit}
          handleClose={handleEditClose}
          currentBook={currentBook}
          categories={categories}
          tags={tags}
          handleBookChange={(field, value) => setCurrentBook((prev) => ({ ...prev, [field]: value }))}
          handleEditSubmit={handleEditSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Manage Chapters Dialog */}
      {selectedBook && <ManageChaptersDialog open={manageChaptersOpen} handleClose={handleManageChaptersClose} book={selectedBook} />}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this book? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BooksTab;
