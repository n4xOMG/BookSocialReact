import { Delete, Edit, Search, Add as AddIcon, FilterList, Refresh, ToggleOn, ToggleOff, MonetizationOn } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activateCreditPackage,
  createCreditPackage,
  deactivateCreditPackage,
  deleteCreditPackage,
  getAllCreditPackages,
  getCreditPackagesSortedByCreditAmountDesc,
  updateCreditPackage,
} from "../../../redux/creditpackage/creditpackage.action";
import LoadingSpinner from "../../LoadingSpinner";
import { useTheme } from "@emotion/react";

const CreditsManagement = () => {
  const dispatch = useDispatch();
  const { creditPackages, loading, error } = useSelector((state) => state.creditpackage);

  // State for dialog management
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // State for form management
  const [currentPackage, setCurrentPackage] = useState({
    name: "",
    description: "",
    creditAmount: "",
    price: "",
    active: false,
  });

  // State for form validation
  const [formErrors, setFormErrors] = useState({});

  // State for table management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // State for notification
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State for filter menu
  const [anchorEl, setAnchorEl] = useState(null);

  // Stats for credit packages
  const totalPackages = creditPackages.length;
  const activePackages = creditPackages.filter((pkg) => pkg.active).length;
  const averagePrice =
    creditPackages.length > 0 ? (creditPackages.reduce((acc, pkg) => acc + pkg.price, 0) / creditPackages.length).toFixed(2) : 0;
  const bestValuePackage =
    creditPackages.length > 0
      ? creditPackages.reduce(
          (best, pkg) => (pkg.creditAmount / pkg.price > best.creditAmount / best.price ? pkg : best),
          creditPackages[0]
        )
      : null;

  useEffect(() => {
    dispatch(getAllCreditPackages());
  }, [dispatch]);

  useEffect(() => {
  if (isMobile && viewMode !== "grid") {
    setViewMode("grid");
  }
}, [isMobile, viewMode]);

  // Form handling methods
  const handleOpen = (pkg = null) => {
    if (pkg) {
      setCurrentPackage({
        ...pkg,
        description: pkg.description || "",
      });
    } else {
      setCurrentPackage({
        name: "",
        description: "",
        creditAmount: "",
        price: "",
        active: true,
      });
    }
    setFormErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPackage((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!currentPackage.name.trim()) errors.name = "Name is required";
    if (!currentPackage.creditAmount) errors.creditAmount = "Credit amount is required";
    else if (isNaN(currentPackage.creditAmount) || parseInt(currentPackage.creditAmount) <= 0)
      errors.creditAmount = "Credit amount must be a positive number";

    if (!currentPackage.price) errors.price = "Price is required";
    else if (isNaN(currentPackage.price) || parseFloat(currentPackage.price) <= 0) errors.price = "Price must be a positive number";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const { id, name, description, creditAmount, price, active } = currentPackage;
    const packageData = {
      name,
      description,
      creditAmount: parseInt(creditAmount, 10),
      price: parseFloat(price),
      active,
    };

    if (id) {
      dispatch(updateCreditPackage(id, packageData));
      setNotification({
        open: true,
        message: "Credit package updated successfully",
        severity: "success",
      });
    } else {
      dispatch(createCreditPackage(packageData));
      setNotification({
        open: true,
        message: "Credit package created successfully",
        severity: "success",
      });
    }

    handleClose();
  };

  // Delete handling methods
  const openDeleteConfirm = (pkg) => {
    setPackageToDelete(pkg);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteCreditPackage(packageToDelete.id));
    setConfirmDialogOpen(false);
    setPackageToDelete(null);
    setNotification({
      open: true,
      message: "Credit package deleted successfully",
      severity: "success",
    });
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setPackageToDelete(null);
  };

  // Table handling methods
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleStatusToggle = async (pkg) => {
    try {
      if (pkg.active) {
        await dispatch(deactivateCreditPackage(pkg.id));
        setNotification({
          open: true,
          message: "Package deactivated",
          severity: "info",
        });
      } else {
        await dispatch(activateCreditPackage(pkg.id));
        setNotification({
          open: true,
          message: "Package activated",
          severity: "success",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleFilterMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    handleFilterMenuClose();
  };

  const handleSortByCreditAmount = () => {
    dispatch(getCreditPackagesSortedByCreditAmountDesc());
    handleFilterMenuClose();
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Filter and sort the packages
  const filteredPackages = creditPackages
    .filter((pkg) => pkg.name.toLowerCase().includes(filterName.toLowerCase()))
    .filter((pkg) => {
      if (filterStatus === "all") return true;
      return filterStatus === "active" ? pkg.active : !pkg.active;
    })
    .sort((a, b) => {
      const isAsc = order === "asc";
      switch (orderBy) {
        case "name":
          return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        case "price":
          return isAsc ? a.price - b.price : b.price - a.price;
        case "creditAmount":
          return isAsc ? a.creditAmount - b.creditAmount : b.creditAmount - a.creditAmount;
        case "active":
          return isAsc ? (a.active === b.active ? 0 : a.active ? -1 : 1) : a.active === b.active ? 0 : a.active ? 1 : -1;
        default:
          return 0;
      }
    });

  // Pagination
  const paginatedPackages = filteredPackages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="500">
        Credits Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                Total Packages
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {totalPackages}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                Active Packages
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {activePackages}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                Average Price
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                ${averagePrice}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                Best Value Package
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                {bestValuePackage?.name || "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {loading && <LoadingSpinner />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Toolbar with actions */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: isMobile ? "column" : "row" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search packages..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            value={filterName}
            onChange={handleFilterByName}
            sx={{ mr: 2, width: 200 }}
          />

          <Button color="primary" startIcon={<FilterList />} onClick={handleFilterMenuOpen} size="small" variant="outlined" sx={{ mr: 2 }}>
            Filter
          </Button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterMenuClose}>
            <MenuItem onClick={() => handleFilterStatus("all")}>All Packages</MenuItem>
            <MenuItem onClick={() => handleFilterStatus("active")}>Active Only</MenuItem>
            <MenuItem onClick={() => handleFilterStatus("inactive")}>Inactive Only</MenuItem>
            <Divider />
            <MenuItem onClick={handleSortByCreditAmount}>Sort By Credit Amount</MenuItem>
          </Menu>

          <IconButton onClick={() => dispatch(getAllCreditPackages())} color="primary" size="small">
            <Refresh />
          </IconButton>
        </Box>

        <Box>
          <Button variant="contained" color="primary" onClick={() => handleOpen()} startIcon={<AddIcon />} sx={{mt: isMobile ? 1 : 0}}>
            Add Credit Package
          </Button>
        </Box>
      </Box>

      {/* View toggle buttons */}
      {!isMobile && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            color={viewMode === "table" ? "primary" : "inherit"}
            onClick={() => setViewMode("table")}
            variant={viewMode === "table" ? "contained" : "text"}
            size="small"
            sx={{ mr: 1 }}
          >
            Table View
          </Button>
          <Button
            color={viewMode === "grid" ? "primary" : "inherit"}
            onClick={() => setViewMode("grid")}
            variant={viewMode === "grid" ? "contained" : "text"}
            size="small"
          >
            Grid View
          </Button>
        </Box>
      )}
        
      {/* Table View */}
      {viewMode === "table" && !isMobile && (
        <>
          <TableContainer component={Paper} elevation={2} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "background.subtle" }}>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Package Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "price"}
                      direction={orderBy === "price" ? order : "asc"}
                      onClick={() => handleRequestSort("price")}
                    >
                      Price ($)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "creditAmount"}
                      direction={orderBy === "creditAmount" ? order : "asc"}
                      onClick={() => handleRequestSort("creditAmount")}
                    >
                      Credits
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "active"}
                      direction={orderBy === "active" ? order : "asc"}
                      onClick={() => handleRequestSort("active")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPackages.map((pkg) => (
                  <TableRow key={pkg.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {pkg.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {pkg.description || "No description"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        ${pkg.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<MonetizationOn fontSize="small" />}
                        label={pkg.creditAmount}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={pkg.active ? "Active" : "Inactive"} size="small" color={pkg.active ? "success" : "default"} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={pkg.active ? "Deactivate" : "Activate"}>
                        <IconButton onClick={() => handleStatusToggle(pkg)} color={pkg.active ? "success" : "default"}>
                          {pkg.active ? <ToggleOn /> : <ToggleOff />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpen(pkg)} color="primary">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => openDeleteConfirm(pkg)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedPackages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No packages found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredPackages.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            {paginatedPackages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                    border: pkg.active ? `1px solid ${pkg.active ? "#4caf50" : "#e0e0e0"}` : "none",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" component="div" fontWeight="500">
                        {pkg.name}
                      </Typography>
                      <Chip label={pkg.active ? "Active" : "Inactive"} size="small" color={pkg.active ? "success" : "default"} />
                    </Box>

                    <Typography color="textSecondary" variant="body2" sx={{ mb: 2, minHeight: 40 }}>
                      {pkg.description || "No description available for this credit package."}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h5" component="div" fontWeight="bold" color="primary.main">
                        ${pkg.price.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MonetizationOn color="primary" sx={{ mr: 0.5 }} />
                        <Typography variant="h6" component="div">
                          {pkg.creditAmount} credits
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Button startIcon={<Edit />} color="primary" variant="outlined" size="small" onClick={() => handleOpen(pkg)}>
                        Edit
                      </Button>
                      <Box>
                        <IconButton onClick={() => handleStatusToggle(pkg)} color={pkg.active ? "success" : "default"} size="small">
                          {pkg.active ? <ToggleOn /> : <ToggleOff />}
                        </IconButton>
                        <IconButton color="error" onClick={() => openDeleteConfirm(pkg)} size="small">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {paginatedPackages.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body1" color="textSecondary">
                    No packages found
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>

          <TablePagination
            component="div"
            count={filteredPackages.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}

      {/* Add/Edit Credit Package Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{currentPackage.id ? "Edit Credit Package" : "Add Credit Package"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth error={!!formErrors.name} sx={{ mt: 1, mb: 2 }}>
            <TextField
              label="Package Name"
              name="name"
              fullWidth
              value={currentPackage.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              placeholder="e.g., Basic Package, Premium Bundle"
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Description (optional)"
              name="description"
              fullWidth
              value={currentPackage.description}
              onChange={handleChange}
              multiline
              rows={2}
              placeholder="Brief description of what this package offers"
            />
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.creditAmount} sx={{ mb: 2 }}>
                <TextField
                  label="Credit Amount"
                  name="creditAmount"
                  type="number"
                  fullWidth
                  value={currentPackage.creditAmount}
                  onChange={handleChange}
                  error={!!formErrors.creditAmount}
                  helperText={formErrors.creditAmount}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Credits</InputAdornment>,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.price} sx={{ mb: 2 }}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  fullWidth
                  value={currentPackage.price}
                  onChange={handleChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          <FormControlLabel
            control={<Switch checked={currentPackage.active} onChange={handleChange} name="active" color="primary" />}
            label={
              <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1">{currentPackage.active ? "Active package" : "Inactive package"}</Typography>
                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                  ({currentPackage.active ? "Visible to users" : "Hidden from users"})
                </Typography>
              </Box>
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {currentPackage.id ? "Update Package" : "Add Package"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the credit package "{packageToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreditsManagement;
