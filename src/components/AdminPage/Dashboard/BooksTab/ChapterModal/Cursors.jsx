import { useOthers } from "@liveblocks/react";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ReactEditor } from "slate-react";
import { Editor, Range } from "slate";

// SVG cursor icon component
const CursorIcon = ({ color }) => (
  <svg
    width="24"
    height="36"
    viewBox="0 0 24 36"
    fill="none"
    stroke="white"
    strokeWidth="1.5"
    style={{
      fill: color || "#000",
      filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.3))",
    }}
  >
    <path d="M5.65376 12.3271L5.46443 0.500057L18.4953 14.5072L12.1023 15.0547L18.6361 22.0937L15.4053 24.9325L8.87156 17.8935L5.65376 12.3271Z" />
  </svg>
);

export function Cursors({ children, editorRef, editorDomRef }) {
  const others = useOthers();
  const [cursorPositions, setCursorPositions] = useState([]);
  const [selectionRanges, setSelectionRanges] = useState([]);
  const [debug, setDebug] = useState({ users: 0, cursors: 0 });

  // Track and render other users' cursors and selections
  useEffect(() => {
    // Log presence data for debugging
    console.log(
      "Others presence data:",
      others.map((u) => ({ id: u.connectionId, cursor: u.presence?.cursor }))
    );

    // Update debug metrics
    setDebug({
      users: others.length,
      cursors: others.filter((user) => user.presence?.cursor).length,
    });

    // Update cursors on an interval to ensure smooth rendering
    const updateInterval = setInterval(() => {
      updateCursorsAndSelections();
    }, 33); // ~30fps

    // Initial update
    updateCursorsAndSelections();

    return () => {
      clearInterval(updateInterval);
    };

    // Function to update cursors and selections
    function updateCursorsAndSelections() {
      if (!editorRef.current) return;

      try {
        // Get DOM element for positioning - use either the passed ref or try to get it
        const editorEl =
          editorDomRef?.current ||
          (() => {
            try {
              return ReactEditor.toDOMNode(editorRef.current, editorRef.current);
            } catch (err) {
              return null;
            }
          })();

        if (!editorEl) return;

        // Process absolute cursor positions (mouse pointers)
        const updatedCursors = others
          .filter((user) => user.presence?.cursor)
          .map(({ presence, connectionId }) => {
            const cursor = presence.cursor;
            if (!cursor || typeof cursor.x !== "number" || typeof cursor.y !== "number") {
              return null;
            }

            return {
              connectionId,
              user: presence.user || { name: "Anonymous", color: "#ff0000" },
              position: { x: cursor.x, y: cursor.y },
            };
          })
          .filter(Boolean);

        // Process text selection ranges
        const updatedSelections = others
          .filter((user) => user.presence?.selection)
          .map(({ presence, connectionId }) => {
            try {
              if (!presence.selection) return null;

              // Skip invalid selections
              if (!presence.selection.anchor || !presence.selection.focus) {
                return null;
              }

              // Skip collapsed selections (cursor position only)
              if (Range.isCollapsed(presence.selection)) {
                return null;
              }

              // Convert to DOM range and get client rects
              const domRange = ReactEditor.toDOMRange(editorRef.current, presence.selection);
              const editorRect = editorEl.getBoundingClientRect();

              // Get client rects for potentially multi-line selections
              const clientRects = Array.from(domRange.getClientRects());
              if (clientRects.length === 0) return null;

              // Map to relative positions
              const rects = clientRects.map((rect) => ({
                top: rect.top - editorRect.top,
                left: rect.left - editorRect.left,
                width: rect.width,
                height: rect.height,
              }));

              return {
                connectionId,
                user: presence.user || { name: "Anonymous", color: "#ff0000" },
                rects,
              };
            } catch (err) {
              // Silently fail for selection errors
              return null;
            }
          })
          .filter(Boolean);

        setCursorPositions(updatedCursors);
        setSelectionRanges(updatedSelections);
      } catch (error) {
        console.error("Error updating cursors:", error);
      }
    }
  }, [others, editorRef, editorDomRef]);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {children}

      {/* Debug overlay */}
      {process.env.NODE_ENV === "development" && (
        <Box
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            background: "rgba(0,0,0,0.1)",
            padding: "4px 8px",
            borderRadius: 1,
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          <Typography variant="caption">
            Connected users: {debug.users}, Cursors: {debug.cursors}
          </Typography>
        </Box>
      )}

      {/* Selection highlights */}
      {selectionRanges.map(({ connectionId, user, rects }) => (
        <React.Fragment key={`selection-${connectionId}`}>
          {rects.map((rect, index) => (
            <Box
              key={`selection-${connectionId}-${index}`}
              sx={{
                position: "absolute",
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                backgroundColor: user.color || "#ff0000",
                opacity: 0.2,
                pointerEvents: "none",
                zIndex: 40,
              }}
            />
          ))}
        </React.Fragment>
      ))}

      {/* Mouse cursors */}
      {cursorPositions.map(({ connectionId, user, position }) => (
        <Box
          key={`cursor-${connectionId}`}
          sx={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            pointerEvents: "none",
            zIndex: 50,
            transition: "transform 0.05s ease, left 0.05s ease, top 0.05s ease",
          }}
        >
          <CursorIcon color={user.color || "#ff0000"} />

          <Box
            sx={{
              position: "absolute",
              top: "15px",
              left: "15px",
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
