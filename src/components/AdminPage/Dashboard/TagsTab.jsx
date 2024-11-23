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
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addTag, deleteTag, editTag, getTags } from "../../../redux/tag/tag.action";
import LoadingSpinner from "../../LoadingSpinner";

const TagsTab = () => {
  const { tags } = useSelector((state) => state.tag);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState({ name: "" });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    await dispatch(getTags());
    setLoading(false);
  };

  const handleOpen = (tag = { name: "" }) => {
    setCurrentTag(tag);
    setOpen(true);
  };

  const handleClose = () => {
    setCurrentTag({ name: "" });
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (currentTag.id) {
      await dispatch(editTag(currentTag.id, currentTag));
    } else {
      await dispatch(addTag(currentTag));
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      await dispatch(deleteTag(id));
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>
            Tags Management
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
            Add Tag
          </Button>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tag Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpen(tag)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDelete(tag.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Add/Edit Tag Dialog */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{currentTag.id ? "Edit Tag" : "Add Tag"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                label="Tag Name"
                name="name"
                fullWidth
                value={currentTag.name}
                onChange={(e) => setCurrentTag({ ...currentTag, name: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {currentTag.id ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default TagsTab;
