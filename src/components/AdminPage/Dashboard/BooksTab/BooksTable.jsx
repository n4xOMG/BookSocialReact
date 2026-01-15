import React from "react";
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Avatar,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { formatExactTime } from "../../../../utils/formatDate";

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
  isMobile,
}) => {
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "ONGOING":
        return "primary";
      case "COMPLETED":
        return "success";
      case "HIATUS":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };



  // Truncate description
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "No description";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  const renderMobileCards = () => (
    <Stack spacing={2}>
      {books.map((book) => (
        <Paper key={book.id} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <Avatar
              src={book.bookCover.url}
              variant="rounded"
              sx={{ width: 70, height: 100 }}
            />

            <Box flex={1}>
              <Typography fontWeight="bold" sx={{textAlign: "left"}}>
                {book.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{textAlign: "left"}}>
                {truncateText(book.description, 80)}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{textAlign: "left"}}>
                Author: {book.author?.username || "Unknown"}
              </Typography>

              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                <Chip
                  label={book.status || "N/A"}
                  size="small"
                  color={getStatusColor(book.status)}
                  variant="outlined"
                />

                {book.category && (
                  <Chip label={book.category.name} size="small" />
                )}
              </Stack>

              {/* Stats */}
              <Stack direction="row" spacing={2} mt={1}>
                <Typography variant="caption">👁 {book.viewCount || 0}</Typography>
                <Typography variant="caption">❤️ {book.favCount || 0}</Typography>
                <Typography variant="caption">
                  ⭐ {book.avgRating ? book.avgRating.toFixed(1) : "-"}
                </Typography>
              </Stack>

              {/* Actions */}
              <Stack direction="row" spacing={1} mt={1}>
                <IconButton size="small" onClick={() => handleEditOpen(book)}>
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton size="small" onClick={() => handleManageChapters(book)}>
                  <MenuBookIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => handleToggleIsSuggested(book.id, {
                    ...book,
                    suggested: !book.suggested,
                  })}
                  color={book.suggested ? "warning" : "default"}
                >
                  {book.suggested ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(book.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );

  return (
    <>
      {isMobile ? (
        <>
          {renderMobileCards()}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalBooks}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: "auto" }}>
            <Table stickyHeader aria-label="books table">
              <TableHead>
                <TableRow>
                  <TableCell>Book</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Stats</TableCell>
                  <TableCell align="center">Featured</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar alt={book.title} src={book.bookCover.url} variant="rounded" sx={{ width: 60, height: 80, objectFit: "cover" }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {book.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {truncateText(book.description, 50)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Added: {formatExactTime(book.uploadDate)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{book.author?.username || book.authorName || "Unknown"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={book.status || "N/A"} color={getStatusColor(book.status)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{book.category?.name || book.categoryName || "Uncategorized"}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: 200 }}>
                        {book.tags && book.tags.length > 0
                          ? book.tags.map((tag) => <Chip key={tag.id} label={tag.name} size="small" />)
                          : book.tagNames && book.tagNames.length > 0
                          ? book.tagNames.map((tagName, idx) => <Chip key={idx} label={tagName} size="small" />)
                          : "No tags"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Tooltip title="Views">
                          <Box display="flex" alignItems="center">
                            <VisibilityIcon fontSize="small" color="action" />
                            <Typography variant="body2" ml={0.5}>
                              {book.viewCount || 0}
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title="Likes">
                          <Box display="flex" alignItems="center">
                            <FavoriteIcon fontSize="small" color="action" />
                            <Typography variant="body2" ml={0.5}>
                              {book.favCount || 0}
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title={`Rating: ${book.avgRating?.toFixed(1) || "No ratings"}`}>
                          <Box display="flex" alignItems="center">
                            <RateReviewIcon fontSize="small" color="action" />
                            <Typography variant="body2" ml={0.5}>
                              {book.avgRating ? book.avgRating.toFixed(1) : "-"}({book.ratingCount || 0})
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={book.suggested ? "Remove from featured" : "Add to featured"}>
                        <IconButton
                          onClick={() => handleToggleIsSuggested(book.id, { ...book, suggested: !book.suggested })}
                          color={book.suggested ? "warning" : "default"}
                        >
                          {book.suggested ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip title="Edit Book">
                          <IconButton color="primary" onClick={() => handleEditOpen(book)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Manage Chapters">
                          <IconButton color="info" onClick={() => handleManageChapters(book)}>
                            <MenuBookIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Book">
                          <IconButton color="error" onClick={() => handleDelete(book.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {books.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No books found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalBooks}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
};

export default BooksTable;
