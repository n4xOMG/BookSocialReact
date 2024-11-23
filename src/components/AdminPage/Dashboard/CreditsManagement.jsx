import { Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCreditPackage,
  deleteCreditPackage,
  getAllCreditPackages,
  updateCreditPackage,
} from "../../../redux/creditpackage/creditpackage.action";
import LoadingSpinner from "../../LoadingSpinner";

const CreditsManagement = () => {
  const dispatch = useDispatch();
  const { creditPackages, loading, error } = useSelector((state) => state.creditpackage);

  const [open, setOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState({
    name: "",
    creditAmount: "",
    price: "",
    active: false,
  });

  useEffect(() => {
    dispatch(getAllCreditPackages());
  }, [dispatch]);

  const handleOpen = (pkg = null) => {
    if (pkg) {
      setCurrentPackage({ ...pkg });
    } else {
      setCurrentPackage({
        name: "",
        creditAmount: "",
        price: "",
        active: false,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setCurrentPackage({
      name: "",
      creditAmount: "",
      price: "",
      active: false,
    });
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPackage((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const { id, name, creditAmount, price, active } = currentPackage;
    const packageData = {
      name,
      creditAmount: parseInt(creditAmount, 10),
      price: parseFloat(price),
      active,
    };

    if (id) {
      dispatch(updateCreditPackage(id, packageData));
    } else {
      dispatch(createCreditPackage(packageData));
    }

    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this credit package?")) {
      dispatch(deleteCreditPackage(id));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Credits Management
      </Typography>

      {loading && <LoadingSpinner />}
      {error && <Alert severity="error">{error}</Alert>}

      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add Credit Package
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Package Name</TableCell>
            <TableCell>Price ($)</TableCell>
            <TableCell>Credits</TableCell>
            <TableCell>Active</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {creditPackages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell>{pkg.name}</TableCell>
              <TableCell>{pkg.price.toFixed(2)}</TableCell>
              <TableCell>{pkg.creditAmount}</TableCell>
              <TableCell>{pkg.active ? "Yes" : "No"}</TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleOpen(pkg)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => handleDelete(pkg.id)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Credit Package Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentPackage.id ? "Edit Credit Package" : "Add Credit Package"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Package Name" name="name" fullWidth value={currentPackage.name} onChange={handleChange} />
          <TextField
            margin="dense"
            label="Credit Amount"
            name="creditAmount"
            type="number"
            fullWidth
            value={currentPackage.creditAmount}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Price ($)"
            name="price"
            type="number"
            fullWidth
            value={currentPackage.price}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Switch checked={currentPackage.active} onChange={handleChange} name="active" color="primary" />}
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {currentPackage.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreditsManagement;
