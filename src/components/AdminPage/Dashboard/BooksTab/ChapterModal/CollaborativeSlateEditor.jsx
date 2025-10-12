import React, { useCallback, useEffect } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { Slate, Editable } from "slate-react";
import isHotkey from "is-hotkey";

import { useSlateEditor } from "../../../../../hooks/useSlateEditor";
import { useCollaborationPresence } from "../../../../../hooks/useCollaborationPresence";
import { Element, Leaf } from "./TextEditorUtils/Element";
import { HOTKEYS } from "./TextEditorUtils/ToolbarFunctions";
import { toggleMark } from "./TextEditorUtils/MarkButton";
import { Cursors } from "./Cursors";
import { EditorToolbar } from "./EditorToolbar";

/**
 * Collaborative Slate Editor component
 */
export const CollaborativeSlateEditor = ({ sharedType, provider, initialContent, onContentChange }) => {
  const { editor, editorRef, editorReady, initialValue, handleSlateChange } = useSlateEditor(
    sharedType,
    provider,
    initialContent,
    onContentChange
  );

  const { updateSelection, editorDomRef } = useCollaborationPresence(editor, editorReady);
  useEffect(() => {
    console.log("Received content in slate editor: ", initialContent);
  });
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
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "12px",
        backgroundColor: "#fff",
        width: "100%",
        margin: "0 auto",
        maxWidth: "1000px",
        overflow: "auto",
        color: "#111827",
      }}
    >
      <Box
        sx={{
          position: "relative",
          padding: "1.5em",
          height: "100%",
        }}
      >
        <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
          <EditorToolbar />

          {editorReady ? (
            <Cursors editorRef={editorRef} editorDomRef={editorDomRef}>
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Enter some text..."
                onKeyDown={handleKeyDown}
                style={{
                  minHeight: "500px",
                  padding: "8px",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
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
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
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
        </Slate>
      </Box>
    </Paper>
  );
};
