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
  Chip,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import VisibilityIcon from "@mui/icons-material/Visibility";

const PopularChaptersTable = ({ chapters = [] }) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ p: 2, height: "100%", borderRadius: "16px", border: "1px solid", borderColor: theme.palette.divider }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Trending Chapters
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Chapter</TableCell>
              <TableCell>Book</TableCell>
              <TableCell align="right">Reads</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chapters.length > 0 ? (
              chapters.map((chapter, index) => (
                <TableRow key={chapter.id || index} hover>
                  <TableCell>
                    <Box>
                       <Typography variant="body2" fontWeight="medium">
                         {chapter.title}
                       </Typography>
                       <Typography variant="caption" color="text.secondary">
                         Ch. {chapter.chapterNumber}
                       </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.primary" noWrap sx={{ maxWidth: 120 }}>
                      {chapter.bookTitle}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                      <VisibilityIcon fontSize="small" color="action" />
                      {chapter.readCount?.toLocaleString()}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
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

PopularChaptersTable.propTypes = {
  chapters: PropTypes.array,
};

export default PopularChaptersTable;
