import { useOthers } from "@liveblocks/react";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ReactEditor } from "slate-react";
import { Editor, Range } from "slate";

export function Cursors({ children, editorRef }) {
  const others = useOthers();
  const [cursorPositions, setCursorPositions] = useState([]);

  useEffect(() => {
    // Function to update cursor positions
    const updateCursors = () => {
      if (!editorRef.current || !others) return;

      try {
        const editor = editorRef.current;

        // Verify editor has been mounted to DOM
        let editorEl;
        try {
          editorEl = ReactEditor.toDOMNode(editor, editor);
        } catch (err) {
          // Editor not yet connected to DOM
          console.warn("Editor not yet connected to DOM:", err);
          return;
        }

        const editorRect = editorEl.getBoundingClientRect();

        const updatedCursors = others
          .filter((user) => user.presence?.cursor)
          .map(({ presence, connectionId }) => {
            if (!presence.cursor) return null;

            try {
              // Create a range from the cursor position
              const range = {
                anchor: presence.cursor.anchor,
                focus: presence.cursor.focus || presence.cursor.anchor, // Ensure we have a focus point
              };

              // Make sure the range is valid for this editor
              if (
                !range.anchor ||
                !range.focus ||
                range.anchor.path.some((p) => typeof p !== "number") ||
                range.focus.path.some((p) => typeof p !== "number")
              ) {
                return null;
              }

              // Validate path exists in the document
              try {
                Editor.node(editor, range.anchor.path);
                Editor.node(editor, range.focus.path);
              } catch (err) {
                // Path doesn't exist in this document
                return null;
              }

              // Get DOM rect for the range
              let domRange;
              try {
                domRange = ReactEditor.toDOMRange(editor, range);
              } catch (err) {
                console.warn("Could not convert to DOM range:", err);
                return null;
              }

              const rect = domRange.getBoundingClientRect();

              // Calculate position relative to editor
              return {
                connectionId,
                user: presence.user || { name: "Anonymous", color: "#ff0000" },
                rect: {
                  top: rect.top - editorRect.top,
                  left: rect.left - editorRect.left,
                  height: rect.height,
                  width: 2, // Width of cursor line
                },
              };
            } catch (err) {
              console.warn("Error rendering cursor:", err);
              return null;
            }
          })
          .filter(Boolean);

        setCursorPositions(updatedCursors);
      } catch (error) {
        console.error("Error updating cursors:", error);
      }
    };

    // Initialize and set up event listeners
    const timeoutId = setTimeout(updateCursors, 500); // Initial delay to ensure editor is mounted

    // Update on window resize and scroll
    window.addEventListener("resize", updateCursors);
    window.addEventListener("scroll", updateCursors);

    // Update periodically to handle any missed updates
    const interval = setInterval(updateCursors, 1000);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateCursors);
      window.removeEventListener("scroll", updateCursors);
      clearInterval(interval);
    };
  }, [others, editorRef]);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {children}
      {cursorPositions.map(({ connectionId, user, rect }) => (
        <Box
          key={connectionId}
          sx={{
            position: "absolute",
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            backgroundColor: user.color || "#ff0000",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "-20px",
              left: "0",
              backgroundColor: user.color || "#ff0000",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 51,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.name || "Anonymous"}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
