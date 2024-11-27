import { Backdrop, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
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

  const isManga = getTagsByIds(book?.tags || []).some((tag) => tag.name.toLowerCase() === "manga");
  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Sidebar />
      <Box
        sx={{
          display: "grid",
          maxWidth: "100%",
          width: "100%",
          height: "100%",
          gridTemplateColumns: "1fr 1fr",
          bgcolor: "background.default",
        }}
      >
        <Box component="aside" sx={{ height: "100%", borderRight: 1, borderColor: "divider", px: 4, pt: 4, bgcolor: "grey.100" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%", maxHeight: "100vh" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Books
              </Typography>
              <Button size="small" onClick={() => navigate("/upload-book")}>
                Add Book
              </Button>
            </Box>
            <Box sx={{ flex: 1, overflow: "auto" }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <BookList
                    books={booksByAuthor}
                    onSelectBook={debouncedSetSelectedBookId}
                    onEditBook={(book) => handleOpenModal("editBook", book)}
                    onDeleteBook={(book) => handleOpenModal("deleteBook", book)}
                  />
                </Grid>
              )}
            </Box>
          </Box>
        </Box>
        <Box component="main" sx={{ px: 4, pt: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Chapters
              </Typography>
              {selectedBookId ? (
                isManga ? (
                  <Button size="small" onClick={() => handleOpenModal("addMangaChapter")}>
                    Add Manga Chapter
                  </Button>
                ) : (
                  <Button size="small" onClick={() => handleOpenModal("addNovelChapter")}>
                    Add Chapter
                  </Button>
                )
              ) : (
                <div>No book selected</div>
              )}
            </Box>
            <Box sx={{ flex: 1, overflow: "auto" }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <UserBookChapterList
                    chapters={chapters}
                    onEditChapter={(chapter) => handleOpenModal("editChapter", chapter)}
                    onDeleteChapter={(chapter) => handleOpenModal("deleteChapter", chapter)}
                  />
                </Grid>
              )}
            </Box>
          </Box>
        </Box>
        <Suspense fallback={<CircularProgress />}>
          {openModal.type === "editBook" && (
            <EditBookDialog open={true} handleClose={handleCloseModal} currentBook={openModal.data} categories={categories} tags={tags} />
          )}
          {openModal.type === "deleteBook" && <DeleteBookModal open={true} onClose={handleCloseModal} deleteBook={openModal.data} />}
          {openModal.type === "addNovelChapter" && <AddChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} />}
          {openModal.type === "addMangaChapter" && <AddMangaChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} />}
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
