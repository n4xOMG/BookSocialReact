import React, { useState, useEffect, useCallback } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Edit, Delete, Block, CheckCircle } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  banUserAction,
  getAllUsers,
  suspendUserAction,
  unbanUserAction,
  unsuspendUserAction,
  updateUserRoleAction,
} from "../../../redux/user/user.action";
import { debounce } from "lodash";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
const UserManagement = () => {
  const { users, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [openAction, setOpenAction] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [newRole, setNewRole] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadUsers = useCallback(
    debounce(async (searchTerm, page) => {
      try {
        await dispatch(getAllUsers(page, 5, searchTerm));
      } catch (e) {
        console.log("Error fetching users: ", e);
      }
    }, 500),
    [dispatch]
  );
  useEffect(() => {
    loadUsers();
  }, [searchTerm, page, loadUsers]);
  const handleSuspend = async (user) => {
    try {
      await dispatch(suspendUserAction(user.id));
      setSuccessMessage("User suspended successfully.");
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to suspend user.");
    }
  };
  const handleUnsuspend = async (user) => {
    try {
      await dispatch(unsuspendUserAction(user.id));
      setSuccessMessage("User unsuspended successfully.");
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to suspend user.");
    }
  };

  const handleBan = async (user) => {
    try {
      await dispatch(banUserAction(user.id));
      setSuccessMessage("User banned successfully.");
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to ban user.");
    }
  };
  const handleUnban = async (user) => {
    try {
      await dispatch(unbanUserAction(user.id));
      setSuccessMessage("User unbanned successfully.");
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to ban user.");
    }
  };
  const handleOpenRoleDialog = (user) => {
    setSelectedUser(user);
    setNewRole(user.role.name); // Assuming role has a 'name' property
    setOpenAction("role");
  };

  const handleClose = () => {
    setSelectedUser(null);
    setOpenAction(false);
    setNewRole("");
  };

  const handleSubmitRole = async () => {
    try {
      await dispatch(updateUserRoleAction(selectedUser.id, newRole));
      setSuccessMessage("User role updated successfully.");
      handleClose();
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to update user role.");
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

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

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Account Status</TableCell>
            <TableCell>Suspension</TableCell>
            <TableCell>Ban</TableCell>
            <TableCell>Total Credits</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isVerified ? "Verified" : "Not Verified"}</TableCell>
              <TableCell>{user.isSuspended ? "Suspened" : "Not Suspended"}</TableCell>
              <TableCell>{user.banned ? "Banned" : "Not Banned"}</TableCell>
              <TableCell>{user.credits}</TableCell>
              <TableCell>{user.role.name}</TableCell>
              <TableCell align="right">
                {user.isSuspended ? (
                  <Tooltip title="Unsuspend User">
                    <IconButton color="success" onClick={() => handleUnsuspend(user)}>
                      <Block />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Suspend User">
                    <IconButton color="error" onClick={() => handleSuspend(user)}>
                      <Block />
                    </IconButton>
                  </Tooltip>
                )}
                {user.banned ? (
                  <Tooltip title="Unban User">
                    <IconButton color="success" onClick={() => handleUnban(user)}>
                      <RemoveCircleIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Ban User">
                    <IconButton color="error" onClick={() => handleBan(user)}>
                      <RemoveCircleIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Update Role">
                  <IconButton color="primary" onClick={() => handleOpenRoleDialog(user)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Role Dialog */}
      <Dialog open={openAction === "role"} onClose={handleClose}>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select labelId="role-select-label" value={newRole} label="Role" onChange={(e) => setNewRole(e.target.value)}>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitRole} variant="contained" color="primary" disabled={!newRole || loading}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          sx={{
            px: 4,
            py: 2,
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: 3,
            "&:disabled": { backgroundColor: "grey.300" },
          }}
        >
          Previous
        </Button>
        <Button onClick={() => setPage(page + 1)} sx={{ px: 4, py: 2, backgroundColor: "black", color: "white", borderRadius: 3 }}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default UserManagement;
