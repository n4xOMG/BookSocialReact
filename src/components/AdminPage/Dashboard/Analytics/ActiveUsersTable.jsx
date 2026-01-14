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
  Chip,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import CommentIcon from "@mui/icons-material/Comment";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const ActiveUsersTable = ({ users = [] }) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: "16px", border: "1px solid", borderColor: theme.palette.divider }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Most Active Users
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="center">Activity</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow key={user.userId || index} hover>
                  <TableCell>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: index < 3 ? theme.palette.primary.main : theme.palette.action.selected,
                        color: index < 3 ? "white" : "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar src={user.avatarUrl} alt={user.username} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {user.fullname || user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Chip
                        icon={<CommentIcon fontSize="small" />}
                        label={user.commentCount || 0}
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                      <Chip
                        icon={<MenuBookIcon fontSize="small" />}
                        label={user.readCount || 0}
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {user.activityScore}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
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

ActiveUsersTable.propTypes = {
  users: PropTypes.array,
};

export default ActiveUsersTable;
