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
import { getAllChaptersByBookIdAction } from "../../../../redux/chapter/chapter.action";
import AddChapterModal from "./ChapterModal/AddNovelChapterModal";
import DeleteChapterModal from "./ChapterModal/DeleteChapterModal";
import EditChapterModal from "./ChapterModal/EditChapterModal";
import { isTokenExpired } from "../../../../utils/useAuthCheck";

const ManageChaptersDialog = ({ open, handleClose, book }) => {
  const dispatch = useDispatch();
  const { chapters, loading, error } = useSelector((state) => state.chapter);
  const jwt = isTokenExpired(localStorage.getItem("jwt")) ? null : localStorage.getItem("jwt");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    if (open && book) {
      dispatch(getAllChaptersByBookIdAction(jwt, book.id));
    }
  }, [open, book, dispatch]);

  const handleAddChapter = () => {
    setAddModalOpen(true);
  };

  const handleEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setEditModalOpen(true);
  };

  const handleDeleteChapter = (chapter) => {
    setSelectedChapter(chapter);
    setDeleteModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedChapter(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedChapter(null);
  };

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
                          <IconButton onClick={() => handleEditChapter(chapter)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Chapter">
                          <IconButton color="error" onClick={() => handleDeleteChapter(chapter)}>
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
          <Button onClick={handleAddChapter} variant="contained" color="primary" startIcon={<Add />}>
            Add Chapter
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Chapter Modal */}
      {addModalOpen && <AddChapterModal open={addModalOpen} onClose={handleAddModalClose} bookId={book.id} />}

      {/* Edit Chapter Modal */}
      {editModalOpen && selectedChapter && (
        <EditChapterModal open={editModalOpen} onClose={handleEditModalClose} bookId={book.id} chapterDetails={selectedChapter} />
      )}

      {/* Delete Chapter Modal */}
      {deleteModalOpen && selectedChapter && (
        <DeleteChapterModal open={deleteModalOpen} onClose={handleDeleteModalClose} bookId={book.id} deleteChapter={selectedChapter} />
      )}
    </>
  );
};

export default ManageChaptersDialog;
