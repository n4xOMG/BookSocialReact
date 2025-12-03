import React, { useState, useEffect, useMemo } from "react";
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
  Stack,
  Pagination,
  Backdrop,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addTag, deleteTag, editTag, getTags } from "../../../redux/tag/tag.action";
import LoadingSpinner from "../../LoadingSpinner";

const TagsTab = () => {
  const { tags } = useSelector((state) => state.tag);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState({ name: "" });

  const [page, setPage] = useState(1); //1-i
  const itemsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const loadTags = async () => {
    setLoading(true);
    await dispatch(getTags());
    setLoading(false);
  };

  const filterTags = useMemo(() => {
    return tags?.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [tags, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filterTags.length /itemsPerPage));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page])

  const paginatedTags = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filterTags.slice(start, start + itemsPerPage);
  }, [filterTags, page])

  const handleOpen = (tag = { name: "" }) => {
    setCurrentTag(tag);
    setOpen(true);
  };

  const handleClose = () => {
    setCurrentTag({ name: "" });
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!currentTag.name || !currentTag.name.trim()) {
      alert("Tag name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      if (currentTag.id) {
        await dispatch(editTag(currentTag.id, currentTag));
      } else {
        await dispatch(addTag(currentTag));
        //jump to last page to show new tag
        const newTotal = tags.length + 1;
        const newPage = Math.ceil(newTotal / itemsPerPage);
        setPage(newPage);
      }
      await loadTags();
      handleClose();
    } catch (err) {
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      setLoading(true);
      try {
        await dispatch(deleteTag(id));
        await loadTags();
        //minus page if it is blank
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const remainingItems = tags.slice(start, end - 1).length - 1;
        if (remainingItems <=0 && page > 1) {
          setPage(page - 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onChangePage = (event, value) => {
    setPage(value);
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ position: "relative", minHeight: "80vh", width: '60%', mx: 'auto', p: 2}}>
          <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit"/>
          </Backdrop>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4" fontWeight={600} sx={{color: "primary.main"}} gutterBottom>
              Tags Management
            </Typography>

            <TextField
              size="small"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "250px"}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />

            <Button variant="contained" color="primary" onClick={() => handleOpen()} >
              Add Tag
            </Button>
          </Stack>
            
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
            <Table >
              <TableHead>
                <TableRow sx={{ backgroundColor: "background.title" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Tag Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 6, color: "text.secondary" }}>
                      No tags found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTags.map((tag) => (
                    <TableRow  
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          backdropFilter: 'blur(8px)',
                          transform: 'scale(1.01)',
                        },
                      }}
                      key={tag.id}>
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
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

          <Stack direction="row" justifyContent="center" sx={{ mb: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={onChangePage}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
            />
          </Stack>

          {/* Add/Edit Tag Dialog */}
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
