import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllChaptersByBookIdAction, manageChapterByBookId } from "../../../../redux/chapter/chapter.action";
import AddChapterModal from "./ChapterModal/AddNovelChapterModal";
import DeleteChapterModal from "./ChapterModal/DeleteChapterModal";
import EditChapterModal from "./ChapterModal/EditChapterModal";
import { isTokenExpired } from "../../../../utils/useAuthCheck";
import EditMangaChapterModal from "./ChapterModal/EditMangaChapterModal";
import AddMangaChapterModal from "./ChapterModal/AddMangaChapterModal";
import { getTags } from "../../../../redux/tag/tag.action";

const ManageChaptersDialog = ({ open, handleClose, book }) => {
  const dispatch = useDispatch();
  const { chapters, error } = useSelector((state) => state.chapter);
  const { tags } = useSelector((state) => state.tag);
  const jwt = isTokenExpired(localStorage.getItem("jwt")) ? null : localStorage.getItem("jwt");
  const [openModal, setOpenModal] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    if (open && book) {
      dispatch(manageChapterByBookId(book.id));
    }
    if (tags.length === 0) {
      dispatch(getTags());
    }
    setLoading(false);
  }, [open, book, dispatch]);

  const handleOpenModal = (type, data = null) => {
    setLoading(false);
    setOpenModal({ type, data });
  };
  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  const getTagsByIds = (tagIds = []) => {
    if (!Array.isArray(tagIds)) {
      console.warn("Expected tagIds to be an array, but got:", tagIds);
      return [];
    }
    return tags.filter((tag) => tagIds.includes(tag.id));
  };
  const isManga = getTagsByIds(book?.tagIds || []).some((tag) => tag.name.toLowerCase() === "manga");
  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Manage Chapters for "{book.title}"</DialogTitle>
        <DialogContent>
          {/* Error Alert */}
          {error && <Alert severity="error">Error loading chapters.</Alert>}

          {/* Loading Indicator */}
          {loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : chapters.length === 0 ? (
            <Alert severity="info">No chapters available.</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Chapter Number</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Is Locked</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chapters.map((chapter) => (
                    <TableRow key={chapter.id} hover>
                      <TableCell>{chapter.chapterNum}</TableCell>
                      <TableCell>{chapter.title}</TableCell>
                      <TableCell>${chapter.price.toFixed(2)}</TableCell>
                      <TableCell>{chapter.isLocked ? "Yes" : "No"}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Chapter">
                          <IconButton onClick={() => handleOpenModal("editChapter", chapter)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Chapter">
                          <IconButton color="error" onClick={() => handleOpenModal("deleteChapter", chapter)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          {book ? (
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
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Chapter Modal */}
      {openModal.type === "addNovelChapter" && <AddChapterModal open={true} onClose={handleCloseModal} bookId={book.id} />}
      {openModal.type === "addMangaChapter" && <AddMangaChapterModal open={true} onClose={handleCloseModal} bookId={book.id} />}

      {/* Edit Chapter Modal */}
      {!isManga && openModal.type === "editChapter" && (
        <EditChapterModal open={true} onClose={handleCloseModal} bookId={book.id} chapterDetails={openModal.data} />
      )}
      {isManga && openModal.type === "editChapter" && (
        <EditMangaChapterModal open={true} onClose={handleCloseModal} bookId={book.id} chapterDetails={openModal.data} />
      )}

      {/* Delete Chapter Modal */}
      {openModal.type === "deleteChapter" && (
        <DeleteChapterModal open={true} onClose={handleCloseModal} bookId={book.id} deleteChapter={openModal.data} />
      )}
    </>
  );
};

export default ManageChaptersDialog;
