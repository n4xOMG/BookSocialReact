import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { addCategory, deleteCategory, editCategory, getCategories } from "../../../redux/category/category.action";
import { fetchContentAnalytics } from "../../../redux/admin/admin.action";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../LoadingSpinner";
import CategoryStats from "./Analytics/CategoryStats";

const CategoriesTab = () => {
  const { categories } = useSelector((state) => state.category);
  const { contentAnalytics } = useSelector((state) => state.admin);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      await Promise.all([
        dispatch(getCategories()),
        dispatch(fetchContentAnalytics())
      ]);
      setLoading(false);
    };
    loadCategories();
  }, []);

  const handleOpen = (category = { name: "", description: "" }) => {
    setCurrentCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setCurrentCategory({ name: "", description: "" });
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (currentCategory.id) {
      await dispatch(editCategory(currentCategory.id, currentCategory));
    } else {
      await dispatch(addCategory(currentCategory));
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    await dispatch(deleteCategory(id));
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box>
          <Box sx={{ mb: 4, height: 400 }}>
             {contentAnalytics?.categoryStats && (
                <CategoryStats stats={contentAnalytics.categoryStats} />
             )}
          </Box>
          <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
            Add Category
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category Name</TableCell>
                <TableCell>Category Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(cat)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(cat.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add/Edit Category Dialog */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{currentCategory.id ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                tabIndex={1}
                margin="dense"
                label="Category Name"
                fullWidth
                required
                value={currentCategory.name}
                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
              />
              <TextField
                tabIndex={2}
                margin="dense"
                label="Category Description"
                fullWidth
                required
                value={currentCategory.description}
                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {currentCategory.id ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default CategoriesTab;
