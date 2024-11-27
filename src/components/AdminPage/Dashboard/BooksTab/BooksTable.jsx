import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TablePagination,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import { Delete, Edit, Image, Star, StarBorder, Book } from "@mui/icons-material";
import { getOptimizedImageUrl } from "../../../../utils/optimizeImages";

const BooksTable = ({
  books,
  loading,
  page,
  rowsPerPage,
  totalBooks,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEditOpen,
  handleDelete,
  handleToggleIsSuggested,
  handleManageChapters,
}) => {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cover Image</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <CircularProgress size={24} />
                  <Typography>Loading...</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
          {!loading && books.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Alert severity="info">No books found.</Alert>
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            books.map((book) => (
              <TableRow key={book.id}>
                {/* Cover Image */}
                <TableCell>
                  {book.bookCover ? (
                    <Avatar
                      variant="square"
                      src={getOptimizedImageUrl(book.bookCover)}
                      alt={`${book.title} cover`}
                      sx={{ width: 56, height: 84 }}
                    />
                  ) : (
                    <Avatar variant="square" sx={{ width: 56, height: 84, bgcolor: "grey.300" }}>
                      <Image />
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.authorName}</TableCell>
                <TableCell>{book.category.name}</TableCell>
                <TableCell>{book.tags?.map((tag) => tag?.name).join(", ")}</TableCell>
                <TableCell>{book.status}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEditOpen(book)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(book.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={book.isSuggested ? "Remove from Editor's Choices" : "Add to Editor's Choices"}>
                    <IconButton color={book.suggested ? "warning" : "success"} onClick={() => handleToggleIsSuggested(book.id, book)}>
                      {book.suggested ? <Star /> : <StarBorder />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Manage Chapters">
                    <IconButton onClick={() => handleManageChapters(book)}>
                      <Book />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalBooks}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
};

export default BooksTable;
