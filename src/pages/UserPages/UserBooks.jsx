import { Backdrop, Box, Button, CircularProgress, Grid, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { debounce } from "lodash";
import React, { Suspense, useCallback, useEffect, useState } from "react";
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
import { UserBookChapterList } from "../../components/UserBooks/UserBookChapterList";
import { getBookByIdAction, getBooksByAuthorAction } from "../../redux/book/book.action";
import { getCategories } from "../../redux/category/category.action";
import { clearChapters, manageChapterByBookId } from "../../redux/chapter/chapter.action";
import { getTags } from "../../redux/tag/tag.action";

const UserBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { booksByAuthor, book } = useSelector((store) => store.book);
  const { chapters } = useSelector((store) => store.chapter);
  const { user } = useSelector((store) => store.auth);
  const { tags } = useSelector((store) => store.tag);
  const { categories } = useSelector((store) => store.category);
  const [openModal, setOpenModal] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const handleOpenModal = (type, data = null) => {
    setLoading(false);
    setOpenModal({ type, data });
  };
  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  useEffect(() => {
    dispatch(clearChapters());
  }, [dispatch]);
  useEffect(() => {
    const fetchBookInfo = async () => {
      setLoading(true);
      try {
        dispatch(getCategories());
        dispatch(getTags());
        await dispatch(getBooksByAuthorAction(user?.id));
      } catch (e) {
        console.log("Error trying to get all books by user: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookInfo();
  }, [dispatch]);

  useEffect(() => {
    if (booksByAuthor.length > 0 && !selectedBookId) {
      setSelectedBookId(booksByAuthor[0].id);
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
          await dispatch(getBookByIdAction(selectedBookId));
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

  const isManga = getTagsByIds(book?.tagIds || []).some((tag) => tag.name.toLowerCase() === "manga");
  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box
        sx={{
          display: isMobile ? "flex" : "grid",
          flexDirection: isMobile ? "column" : "unset",
          maxWidth: "100%",
          width: "100%",
          height: "100%",
          gridTemplateColumns: "1fr 1fr",
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        <Box
          component={Paper}
          elevation={1}
          sx={{
            height: isMobile ? "50vh" : "100%",
            borderRight: isMobile ? 0 : 1,
            borderColor: "divider",
            px: 3,
            pt: 3,
            pb: 2,
            bgcolor: "grey.50",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
              My Books
            </Typography>
            <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/upload-book")}>
              Add Book
            </Button>
          </Box>
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress />
              </Box>
            ) : booksByAuthor.length > 0 ? (
              <BookList
                books={booksByAuthor}
                selectedBookId={selectedBookId}
                onSelectBook={debouncedSetSelectedBookId}
                onEditBook={(book) => handleOpenModal("editBook", book)}
                onDeleteBook={(book) => handleOpenModal("deleteBook", book)}
              />
            ) : (
              <Box
                sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", gap: 2 }}
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
        <Box
          component={Paper}
          elevation={1}
          sx={{
            height: isMobile ? "50vh" : "100%",
            px: 3,
            pt: 3,
            pb: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
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
                sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", gap: 2 }}
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
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Box>
  );
};

export default UserBooks;
