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
  useTheme,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Block, CheckCircle, Search, VerifiedUser, GppBad } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser, updateUser, banUser, suspendUser, unbanUser, unsuspendUser } from "../../../redux/admin/admin.action";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import BanSuspendUserDialog from "./BanSuspendUserDialog";

const UserManagement = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBanSuspendDialog, setOpenBanSuspendDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchAllUsers(page, 10, searchTerm));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchTerm]);

  const getStatusChip = (user) => {
    if (user.banned) {
      return <Chip label="Banned" color="error" size="small" icon={<Block />} />;
    }
    if (user.isSuspended) {
      return <Chip label="Suspended" color="warning" size="small" icon={<GppBad />} />;
    }
    return <Chip label="Active" color="success" size="small" icon={<CheckCircle />} />;
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = (userId, userData) => {
    dispatch(updateUser(userId, userData));
    handleEditClose();
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
        dispatch(deleteUser(selectedUser.id));
        handleDeleteClose();
    }
  };

  const handleBanSuspendClick = (user) => {
    setSelectedUser(user);
    setOpenBanSuspendDialog(true);
  };

  const handleBanSuspendClose = () => {
    setOpenBanSuspendDialog(false);
    setSelectedUser(null);
  };

  const handleBanSuspendAction = (userId, actionType, banReason) => {
    switch (actionType) {
      case "suspend":
        dispatch(suspendUser(userId));
        break;
      case "unsuspend":
        dispatch(unsuspendUser(userId));
        break;
      case "ban":
        dispatch(banUser(userId, banReason));
        break;
      case "unban":
        dispatch(unbanUser(userId));
        break;
      default:
        break;
    }
    handleBanSuspendClose();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" className="font-serif" fontWeight="700" sx={{ color: theme.palette.text.primary }}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user accounts, roles, and statuses.
          </Typography>
        </Box>
        <TextField
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: theme.palette.background.paper,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: theme.palette.divider,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={user.avatarUrl} alt={user.username} sx={{ width: 40, height: 40 }}>
                        {user.username?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {user.fullname || user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role?.name || "USER"}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.divider,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>{getStatusChip(user)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit User">
                      <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => handleEditClick(user)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ban/Suspend">
                      <IconButton size="small" sx={{ color: theme.palette.warning.main }} onClick={() => handleBanSuspendClick(user)}>
                        <Block fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton size="small" sx={{ color: theme.palette.error.main }} onClick={() => handleDeleteClick(user)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No users found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 3, gap: 2 }}>
        <Button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0 || loading}
          variant="outlined"
          sx={{ borderRadius: "8px" }}
        >
          Previous
        </Button>
        <Typography variant="body2" color="text.secondary">
          Page {page + 1}
        </Typography>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={loading || (users && users.length < 10)}
          variant="outlined"
          sx={{ borderRadius: "8px" }}
        >
          Next
        </Button>
      </Box>


      {/* Dialogs */}
      <EditUserDialog
        open={openEditDialog}
        handleClose={handleEditClose}
        handleUpdate={handleUpdateUser}
        user={selectedUser}
      />
      
      <DeleteUserDialog
        open={openDeleteDialog}
        handleClose={handleDeleteClose}
        handleConfirm={handleConfirmDelete}
        user={selectedUser}
      />
      
      <BanSuspendUserDialog
        open={openBanSuspendDialog}
        handleClose={handleBanSuspendClose}
        handleAction={handleBanSuspendAction}
        user={selectedUser}
      />
    </Box>
  );
};

export default UserManagement;
