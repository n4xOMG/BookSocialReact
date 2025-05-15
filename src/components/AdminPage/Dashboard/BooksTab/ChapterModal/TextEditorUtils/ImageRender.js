import React, { useEffect, useState } from "react";
import { Box, CircularProgress, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";

export const Image = ({ attributes, element, children }) => {
  const editor = useSlateStatic();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!element.url) {
      setError(true);
      setIsLoaded(true);
      return;
    }

    const img = new window.Image();
    img.src = element.url;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => {
      console.error("Failed to load image:", element.url);
      setError(true);
      setIsLoaded(true);
    };
  }, [element.url]);

  const removeImage = () => {
    try {
      const path = ReactEditor.findPath(editor, element);
      Transforms.removeNodes(editor, { at: path });
    } catch (err) {
      console.error("Error removing image:", err);
    }
  };

  return (
    <Box
      {...attributes}
      contentEditable={false}
      sx={{
        position: "relative",
        display: "inline-block",
        maxWidth: "100%",
        "&:hover": {
          "& .image-controls": {
            opacity: 1,
          },
        },
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {!isLoaded && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minHeight: "200px",
            bgcolor: "#f5f5f5",
            border: "1px dashed #ccc",
            borderRadius: "4px",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      {error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minHeight: "100px",
            bgcolor: "#fff3f3",
            border: "1px dashed #f88",
            borderRadius: "4px",
            color: "#d32f2f",
            p: 2,
          }}
        >
          Failed to load image
        </Box>
      ) : (
        <Box
          component="img"
          src={element.url}
          alt={element.alt || "Image"}
          sx={{
            maxWidth: "100%",
            display: isLoaded && !error ? "block" : "none",
            height: "auto",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
      )}

      {showControls && (isLoaded || error) && (
        <Box
          className="image-controls"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            opacity: 0,
            transition: "opacity 0.2s",
            bgcolor: "rgba(0,0,0,0.6)",
            borderRadius: "4px",
            zIndex: 100,
          }}
        >
          <IconButton size="small" onClick={removeImage} sx={{ color: "white" }} title="Remove image">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {children}
    </Box>
  );
};
