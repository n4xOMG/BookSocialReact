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
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editChapterAction, getChapterByRoomId } from "../../../../../redux/chapter/chapter.action";

export default function EditChapterModal({ open, onClose, bookId, chapterDetails }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState({
    chapterNum: "",
    title: "",
    price: 0,
    locked: false,
    contentPreview: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChapterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Utility function to strip HTML tags
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Utility function to truncate text to a specified word limit
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  useEffect(() => {
    console.log("EditChapterModal Props:", { open, onClose, bookId, chapterDetails });
    const fetchChapterContent = async () => {
      setLoading(true);
      if (chapterDetails) {
        const plainText = stripHtml(chapterDetails.content || "");
        const truncatedText = truncateText(plainText, 50);
        setChapterData({
          id: chapterDetails.id || "",
          chapterNum: chapterDetails.chapterNum || "",
          title: chapterDetails.title || "",
          price: chapterDetails.price || 0,
          locked: chapterDetails.locked || false,
          contentPreview: truncatedText,
        });
      }
      setLoading(false);
    };

    if (chapterDetails.id) {
      fetchChapterContent();
    }
  }, [dispatch, chapterDetails.id, chapterDetails.content]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log("Form Data:", chapterData);
    try {
      await dispatch(editChapterAction(chapterData));
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleNavigateToWriting = () => {
    dispatch(getChapterByRoomId(chapterDetails.roomId)).then(() => {
      navigate(`/edit-chapter/${chapterDetails.roomId}`);
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>Edit Chapter</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          variant="outlined"
          id="chapterNum"
          label="Chapter Number"
          name="chapterNum"
          onChange={handleChange}
          value={chapterData.chapterNum}
        />
        <TextField
          margin="normal"
          value={chapterData.title}
          required
          variant="outlined"
          fullWidth
          id="title"
          label="Chapter Title"
          name="title"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Price"
          name="price"
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          value={chapterData.price}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControlLabel
          control={<Checkbox checked={chapterData.locked} onChange={handleChange} name="locked" color="primary" />}
          label="Is Locked"
        />
        <TextField
          margin="normal"
          label="Content Preview"
          name="contentPreview"
          multiline
          rows={4}
          value={chapterData.contentPreview}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          variant="outlined"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-wrap",
          }}
        />
        <DialogActions sx={{ px: 3, pb: 2, display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button type="submit" variant="contained" color="primary">
              Update Chapter
            </Button>
            <Button type="button" variant="contained" color="secondary" onClick={handleNavigateToWriting}>
              Continue Writing
            </Button>
          </Box>
        </DialogActions>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
}
