import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withReact } from "slate-react";
import { withCursors, withYjs, YjsEditor } from "@slate-yjs/core";
import { EMPTY_CONTENT } from "../utils/JsonContentUtils";

const emptyNode = {
  type: "paragraph",
  children: [{ text: "" }],
};

/**
 * Custom hook for Slate editor with Yjs integration
 * @param {Object} sharedType - Yjs shared type
 * @param {Object} provider - Yjs provider
 * @param {Array} initialContent - Initial content for the editor
 * @param {Function} onContentChange - Callback when content changes
 * @returns {Object} - Editor instance and related state
 */
export const useSlateEditor = (sharedType, provider, initialContent, onContentChange) => {
  const [editorReady, setEditorReady] = useState(false);
  const editorRef = useRef(null);

  // Memoize initial value to prevent re-renders
  const initialValue = useMemo(() => {
    return initialContent && initialContent.length > 0 ? JSON.parse(JSON.stringify(initialContent)) : EMPTY_CONTENT;
  }, [initialContent]);

  // Create editor instance with Yjs integration
  const editor = useMemo(() => {
    if (!sharedType || !provider) return null;

    // Important: create in the correct order - withYjs must come before withReact
    const e = withReact(withCursors(withYjs(createEditor(), sharedType), provider.awareness));
    editorRef.current = e;

    // Ensure the editor always has at least one valid child
    const { normalizeNode } = e;
    e.normalizeNode = (entry) => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }

      // Insert empty paragraph if needed
      Transforms.insertNodes(e, emptyNode, { at: [0] });
    };

    return e;
  }, [sharedType, provider]);

  // Connect to Yjs when editor is ready
  useEffect(() => {
    if (!editor) return;

    console.log("Connecting editor to Yjs");

    // Connect editor to Yjs
    YjsEditor.connect(editor);

    // Set editor as ready after a delay to ensure DOM is ready
    const readyTimer = setTimeout(() => {
      setEditorReady(true);
      console.log("Editor is ready");
    }, 500);

    return () => {
      clearTimeout(readyTimer);

      // Disconnect from Yjs when unmounting
      try {
        YjsEditor.disconnect(editor);
      } catch (err) {
        console.warn("Error disconnecting editor:", err);
      }

      setEditorReady(false);
    };
  }, [editor]);

  // Handle content changes
  const handleSlateChange = useCallback(
    (newValue) => {
      if (!editor) return;

      const hasContentChanges = editor.operations.some((op) => op.type !== "set_selection");

      if (hasContentChanges) {
        onContentChange(newValue);
      }
    },
    [editor, onContentChange]
  );

  return {
    editor,
    editorRef,
    editorReady,
    initialValue,
    handleSlateChange,
  };
};
