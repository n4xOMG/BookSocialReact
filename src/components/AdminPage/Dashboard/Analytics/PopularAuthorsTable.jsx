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
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import VerifiedIcon from "@mui/icons-material/Verified";

const PopularAuthorsTable = ({ authors = [] }) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ p: 2, height: "100%", borderRadius: "16px", border: "1px solid", borderColor: theme.palette.divider }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Popular Authors
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell align="right">Followers</TableCell>
              <TableCell align="right">Books</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authors.length > 0 ? (
              authors.map((author, index) => (
                <TableRow key={author.id || index} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar src={author.avatar} alt={author.name} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="medium" display="flex" alignItems="center" gap={0.5}>
                          {author.name}
                          {author.verified && <VerifiedIcon fontSize="inherit" color="primary" />}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {author.followerCount?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {author.bookCount}
                    </Typography>
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

PopularAuthorsTable.propTypes = {
  authors: PropTypes.array,
};

export default PopularAuthorsTable;
