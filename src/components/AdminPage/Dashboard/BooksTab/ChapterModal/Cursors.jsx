import { useOthers } from "@liveblocks/react";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ReactEditor } from "slate-react";
import { Editor, Range } from "slate";

export function Cursors({ children, editorRef }) {
  const others = useOthers();
  const [cursorPositions, setCursorPositions] = useState([]);

  useEffect(() => {
    const updatedCursors = others
      .map(({ presence, connectionId }) => {
        if (presence.cursor && presence.user) {
          const { anchor, focus } = presence.cursor;

          // Create a Slate Range from anchor to focus
          const range = { anchor, focus };

          // Convert Slate Range to DOM Range
          let domRange;
          try {
            domRange = ReactEditor.toDOMRange(editorRef.current, range);
          } catch (error) {
            console.error("Error converting Slate Range to DOM Range:", error);
            return null;
          }

          const domRect = domRange.getBoundingClientRect();

          return {
            connectionId,
            user: presence.user,
            rect: domRect,
          };
        }
        return null;
      })
      .filter((cursor) => cursor && cursor.rect !== null);

    setCursorPositions(updatedCursors);
  }, [others, editorRef]);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {children}
      {cursorPositions.map(({ connectionId, user, rect }) => (
        <Box
          key={connectionId}
          sx={{
            position: "absolute",
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
            width: "2px",
            height: `${rect.height}px`,
            backgroundColor: user.color,
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "-1.5em",
              left: "0",
              backgroundColor: user.color,
              color: "#fff",
              padding: "2px 4px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            {user.name}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
