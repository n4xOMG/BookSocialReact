import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteBookAction, getAllBookAction } from "../../../../../redux/book/book.action";
export default function DeleteBookModal({ open, onClose, deleteBook }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async (event) => {
    event.preventDefault();
    console.log("bookId: ", deleteBook.id);
    setLoading(true);
    await dispatch(deleteBookAction(deleteBook.id));
    await dispatch(getAllBookAction());
    setLoading(false);
    onClose();
  };
  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Delete this book?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you want to delete this book?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>No</Button>
            <Button onClick={handleDelete} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
