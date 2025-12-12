import React, { useCallback } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { Slate, Editable } from "slate-react";
import isHotkey from "is-hotkey";

import { useSlateEditor } from "../../../../../hooks/useSlateEditor";
import { useCollaborationPresence } from "../../../../../hooks/useCollaborationPresence";
import { Element, Leaf } from "./TextEditorUtils/Element";
import { HOTKEYS } from "./TextEditorUtils/ToolbarFunctions";
import { toggleMark } from "./TextEditorUtils/MarkButton";
import { Cursors } from "./Cursors";
import { HoveringToolbar } from "./HoveringToolbar";
import { EditorToolbar } from "./EditorToolbar";

/**
 * Collaborative Slate Editor component
 */
export const CollaborativeSlateEditor = ({ sharedType, provider, initialContent, onContentChange, presenceUser }) => {
  const { editor, editorRef, editorReady, initialValue, handleSlateChange } = useSlateEditor(
    sharedType,
    provider,
    initialContent,
    onContentChange
  );

  const { updateSelection, editorDomRef } = useCollaborationPresence(editor, editorReady, presenceUser);
  // Handle content changes with presence updates
  const handleChange = useCallback(
    (newValue) => {
      handleSlateChange(newValue);
      updateSelection();
    },
    [handleSlateChange, updateSelection]
  );

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event) => {
      if (!editor) return;

      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          toggleMark(editor, HOTKEYS[hotkey]);
        }
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "500px",
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Initializing editor...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "12px",
        backgroundColor: "#fff",
        width: "100%",
        margin: "0 auto",
        maxWidth: "1000px",
        color: "#111827",
        height: "100%",
        minHeight: 0, // Important for flex scroll containers
      }}
    >
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        {/* Sticky toolbar container */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#fff",
            borderBottom: "1px solid",
            borderColor: "divider",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <EditorToolbar />
        </Box>
        
        <HoveringToolbar />

        {/* Scrollable content area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            position: "relative",
            minHeight: 0, // Required for flex scroll containers
          }}
        >
          <Box sx={{ padding: "1.5em" }}>
            {editorReady ? (
              <Cursors editorRef={editorRef} editorDomRef={editorDomRef}>
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  placeholder="Enter some text..."
                  onKeyDown={handleKeyDown}
                  style={{
                    minHeight: "500px",
                    padding: "16px",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    border: "none",
                  }}
                />
              </Cursors>
            ) : (
              <Box
                sx={{
                  minHeight: "500px",
                  padding: "8px",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Initializing editor...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Slate>
    </Paper>
  );
};
