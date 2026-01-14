import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Rating,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import VisibilityIcon from "@mui/icons-material/Visibility";

const BestBooksTable = ({ books = [] }) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: "16px", border: "1px solid", borderColor: theme.palette.divider }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Best Performing Books
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Book</TableCell>
              <TableCell>Author</TableCell>
              <TableCell align="right">Views</TableCell>
              <TableCell align="right">Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.length > 0 ? (
              books.map((book, index) => (
                <TableRow key={book.bookId || index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={book.coverImage} variant="rounded" sx={{ width: 40, height: 60 }} />
                      <Typography variant="body2" fontWeight="medium">
                        {book.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{book.authorName}</TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                      <VisibilityIcon fontSize="small" color="action" />
                      {book.viewCount?.toLocaleString()}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <Rating value={book.averageRating || 0} readOnly size="small" precision={0.5} />
                      <Typography variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>
                        ({book.averageRating?.toFixed(1)})
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

BestBooksTable.propTypes = {
  books: PropTypes.array,
};

export default BestBooksTable;
