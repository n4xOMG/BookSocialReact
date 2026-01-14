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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const TopSpendersTable = ({ spenders = [] }) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: "16px", border: "1px solid", borderColor: theme.palette.divider }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Top Spenders
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="right">Total Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spenders.length > 0 ? (
              spenders.map((user, index) => (
                <TableRow key={user.userId || index} hover>
                  <TableCell>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: "gold", // Special color for spenders?
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        border: "1px solid #e0e0e0"
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
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      ${user.totalSpent?.toLocaleString() || "0.00"}
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

TopSpendersTable.propTypes = {
  spenders: PropTypes.array,
};

export default TopSpendersTable;
