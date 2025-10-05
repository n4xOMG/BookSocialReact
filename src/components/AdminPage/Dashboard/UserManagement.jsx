import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Button,
  Alert,
  CircularProgress,
  Paper,
  TableContainer,
} from "@mui/material";
import { Edit, Delete, Block, CheckCircle } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../../redux/admin/admin.action";

const UserManagement = () => {
  const { users, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchAllUsers(page, 10, ""));
  }, [dispatch, page]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role?.name || "USER"}</TableCell>
                  <TableCell>{user.banned ? "Banned" : user.isSuspended ? "Suspended" : "Active"}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit User">
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0 || loading} variant="contained">
          Previous
        </Button>
        <Typography variant="body1" sx={{ alignSelf: "center" }}>
          Page {page + 1}
        </Typography>
        <Button onClick={() => setPage(page + 1)} disabled={loading} variant="contained">
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default UserManagement;
