import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button, Dialog, DialogContent } from "@mui/material";
import React from "react";

export default function ViewImageModal({ open, onClose, image, onNext, onPrev }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        style: {
          maxWidth: "none",
          width: "auto",
          height: "auto",
          margin: 0,
        },
      }}
    >
      <DialogContent
        sx={{
          padding: 0,
          background: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          cursor: "pointer",
          "&:hover .nav-button": {
            opacity: 1,
          },
        }}
      >
        {/* Previous Button */}
        <Button
          onClick={onPrev}
          className="nav-button"
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "0 4px 4px 0",
            padding: 2,
            opacity: 0,
            transition: "opacity 0.3s",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <ArrowBackIcon />
        </Button>

        {/* Image */}
        <img
          src={image}
          alt="Selected"
          style={{
            objectFit: "contain",
            maxHeight: "90vh",
            maxWidth: "90vw",
            height: "auto",
            width: "auto",
          }}
        />

        {/* Next Button */}
        <Button
          onClick={onNext}
          className="nav-button"
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "4px 0 0 4px",
            padding: 2,
            opacity: 0,
            transition: "opacity 0.3s",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <ArrowForwardIcon />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
