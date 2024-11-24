import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Collapse, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBookAction, getBooksByAuthorAction } from "../../redux/book/book.action";
import { getAllChaptersByBookIdAction } from "../../redux/chapter/chapter.action";
import AddChapterModal from "../AdminPage/Dashboard/BooksTab/ChapterModal/AddNovelChapterModal";
import DeleteChapterModal from "../AdminPage/Dashboard/BooksTab/ChapterModal/DeleteChapterModal";
import EditChapterModal from "../AdminPage/Dashboard/BooksTab/ChapterModal/EditChapterModal";
import LoadingSpinner from "../LoadingSpinner";
import ChapterList from "./ChapterList";

import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";
import EditBookDialog from "../AdminPage/Dashboard/BooksTab/EditBookDialog";

const UserBookCard = ({ book }) => {
  const dispatch = useDispatch();

  // Fetch categories and tags from Redux
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
  const { tags, loading: tagsLoading } = useSelector((state) => state.tag);

  const { chapters, loading: chaptersLoading } = useSelector((state) => state.chapter);

  const [addChapterOpen, setAddChapterOpen] = useState(false);
  const [editChapterOpen, setEditChapterOpen] = useState(false);
  const [deleteChapterOpen, setDeleteChapterOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Dialog controls
  const [editBookOpen, setEditBookOpen] = useState(false);
  const [viewBookOpen, setViewBookOpen] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getTags());

    // Fetch chapters
    const fetchChapters = async () => {
      setLoading(true);
      await dispatch(getAllChaptersByBookIdAction(book.id));
      setLoading(false);
    };

    fetchChapters();
  }, [dispatch, book.id]);

  const handleDeleteBook = async () => {
    try {
      await dispatch(deleteBookAction(book.id));
      dispatch(getBooksByAuthorAction(book.author.id));
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  };

  const handleEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setEditChapterOpen(true);
  };

  const handleDeleteChapter = (chapter) => {
    setSelectedChapter(chapter);
    setDeleteChapterOpen(true);
  };

  const handleEditBook = () => {
    setEditBookOpen(true);
  };

  const handleViewBook = () => {
    setViewBookOpen(true);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        avatar={
          book.bookCover ? (
            <Avatar variant="square" src={book.bookCover} alt={book.title} sx={{ width: 56, height: 56 }} />
          ) : (
            <Avatar variant="square">{book.title.charAt(0).toUpperCase()}</Avatar>
          )
        }
        title={
          <Typography variant="h6" component="div">
            {book.title}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            by {book.authorName}
          </Typography>
        }
        action={
          <Box>
            <Tooltip title="Edit Book">
              <IconButton onClick={handleEditBook} color="secondary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Book">
              <IconButton onClick={handleDeleteBook} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} alignItems="center" mb={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Category:
              <Chip label={book.category?.name || "Uncategorized"} size="small" color="primary" sx={{ ml: 1 }} />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Tags:
              {book.tags && book.tags.length > 0 ? (
                book.tags.map((tag) => (
                  <Chip key={tag.id} label={tag.name} size="small" variant="outlined" color="secondary" sx={{ ml: 1, mt: 0.5 }} />
                ))
              ) : (
                <Chip label="No Tags" size="small" variant="outlined" sx={{ ml: 1, mt: 0.5 }} />
              )}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" gutterBottom>
          Chapters
        </Typography>
        {loading || categoriesLoading || tagsLoading || chaptersLoading ? (
          <LoadingSpinner />
        ) : (
          <ChapterList chapters={chapters} onEdit={handleEditChapter} onDelete={handleDeleteChapter} bookId={book.id} />
        )}
        <Button
          startIcon={<AddIcon />}
          onClick={() => setAddChapterOpen(true)}
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          fullWidth={isMobile}
        >
          Add Chapter
        </Button>
      </CardContent>
      <CardContent>
        <Button
          onClick={toggleExpand}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          variant="text"
          color="primary"
          fullWidth={isMobile}
        >
          {expanded ? "Hide Details" : "Show Details"}
        </Button>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, textAlign: "left" }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Description:</strong> {book.description || "No description provided."}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              <strong>Language:</strong> {book.language || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              <strong>Upload Date:</strong> {new Date(book.uploadDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              <strong>Status:</strong> {book.status || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              <strong>View Count:</strong> {book.viewCount}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>

      {/* Add Chapter Modal */}
      <AddChapterModal open={addChapterOpen} onClose={() => setAddChapterOpen(false)} bookId={book.id} />

      {/* Edit Chapter Modal */}
      {selectedChapter && (
        <EditChapterModal
          open={editChapterOpen}
          onClose={() => setEditChapterOpen(false)}
          bookId={book.id}
          chapterDetails={selectedChapter}
        />
      )}

      {/* Delete Chapter Modal */}
      {selectedChapter && (
        <DeleteChapterModal
          open={deleteChapterOpen}
          onClose={() => setDeleteChapterOpen(false)}
          bookId={book.id}
          deleteChapter={selectedChapter}
        />
      )}

      {/* Edit Book Dialog */}
      <EditBookDialog
        open={editBookOpen}
        handleClose={() => setEditBookOpen(false)}
        currentBook={book}
        categories={categories}
        tags={tags}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
};

export default UserBookCard;
