import { Alert, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBookAction, editBookAction, getAllBookAction, setEditorChoice } from "../../../redux/book/book.action";
import { getCategories } from "../../../redux/category/category.action";
import { getTags } from "../../../redux/tag/tag.action";
import UploadToCloudinary from "../../../utils/uploadToCloudinary";
import LoadingSpinner from "../../LoadingSpinner";
import BooksFilter from "./BooksTab/BooksFilter";
import BooksTable from "./BooksTab/BooksTable";
import EditBookDialog from "./BooksTab/EditBookDialog";
import ManageChaptersDialog from "./BooksTab/ManageChaptersDialog";

const BooksTab = () => {
  const dispatch = useDispatch();
  const { books, loading: booksLoading, error: booksError } = useSelector((state) => state.book);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.category);
  const { tags, loading: tagsLoading, error: tagsError } = useSelector((state) => state.tag);
  const [filters, setFilters] = useState({
    category: "",
    tag: "",
    status: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBooks, setTotalBooks] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New state for managing chapters
  const [manageChaptersOpen, setManageChaptersOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        await dispatch(getAllBookAction());
        await dispatch(getCategories());
        await dispatch(getTags());
      } catch (e) {
        console.log(e);
      }
    };
    fetchBooksData();
  }, [dispatch]);

  // Update totalBooks whenever books or filters change
  useEffect(() => {
    setTotalBooks(filteredBooks.length);
  }, [books, filters]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await dispatch(deleteBookAction(id));
        await dispatch(getAllBookAction());
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleToggleIsSuggested = async (id, book) => {
    try {
      await dispatch(setEditorChoice(id, book));
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

      handleEditClose();
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBooks = books.filter((book) => {
    const matchesCategory = filters.category ? book.categoryIds.includes(parseInt(filters.category)) : true;
    const matchesTag = filters.tag ? book.tagIds.includes(parseInt(filters.tag)) : true;
    const matchesStatus = filters.status ? book.status === filters.status : true;
    return matchesCategory && matchesTag && matchesStatus;
  });

  const paginatedBooks = filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const isLoading = booksLoading || categoriesLoading || tagsLoading;

  const getCategoryById = (categoryId) => {
    return categories.find((category) => categoryId === category.id);
  };

  const getTagsByIds = (tagIds) => {
    return tags.filter((tag) => tagIds.includes(tag.id));
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

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Books Overview
      </Typography>

      {/* Error Alerts */}
      {booksError && <Alert severity="error">Error loading books.</Alert>}
      {categoriesError && <Alert severity="error">Error loading categories.</Alert>}
      {tagsError && <Alert severity="error">Error loading tags.</Alert>}

      {/* Filters */}
      <BooksFilter filters={filters} categories={categories} tags={tags} handleFilterChange={handleFilterChange} isDisabled={isLoading} />

      {/* Loading Indicator */}
      {isLoading && <LoadingSpinner />}

      {/* Books Table or No Books Message */}
      {!isLoading && filteredBooks.length === 0 ? (
        <Alert severity="info">No books available.</Alert>
      ) : (
        <BooksTable
          books={paginatedBooks.map((book) => ({
            ...book,
            category: getCategoryById(book.categoryId),
            tags: getTagsByIds(book.tagIds),
          }))}
          loading={isLoading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalBooks={filteredBooks.length}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleEditOpen={handleEditOpen}
          handleDelete={handleDelete}
          handleToggleIsSuggested={handleToggleIsSuggested}
          handleManageChapters={handleManageChapters} // Pass the handler
        />
      )}

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
    </Box>
  );
};

export default BooksTab;
