import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addChapterAction, addDraftChapterAction, getChapterByRoomId } from "../../../../../redux/chapter/chapter.action";

export default function AddChapterModal({ open, onClose, bookId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState({
    chapterNum: "",
    title: "",
    price: 0,
    isLocked: false,
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChapterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    console.log("Form Data:", chapterData);
    try {
      const savedChapter = await dispatch(addDraftChapterAction(bookId, chapterData));
      setLoading(false);
      // Redirect to collaborative editor page with roomId
      dispatch(getChapterByRoomId(savedChapter.payload.roomId)).then(() => {
        navigate(`/edit-chapter/${savedChapter.payload.roomId}`);
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>Add New Chapter</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <TextField
          margin="normal"
          variant="outlined"
          required
          fullWidth
          id="chapterNum"
          label="Chapter number"
          name="chapterNum"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          variant="outlined"
          required
          fullWidth
          id="title"
          label="Chapter title"
          name="title"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Price"
          name="price"
          type="number"
          variant="outlined"
          min={0}
          value={chapterData.price}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControlLabel
          control={<Checkbox checked={chapterData.isLocked} onChange={handleChange} name="isLocked" color="primary" />}
          label="Is Locked"
        />
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create and Start Writing
          </Button>
        </DialogActions>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
}
