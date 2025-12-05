import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withReact } from "slate-react";
import { withCursors, withYjs, YjsEditor } from "@slate-yjs/core";
import { EMPTY_CONTENT } from "../utils/JsonContentUtils";

const emptyNode = {
  type: "paragraph",
  children: [{ text: "" }],
};

const createEmptySlateValue = () => JSON.parse(JSON.stringify(EMPTY_CONTENT));

const cloneSlateValue = (value) => {
  if (!Array.isArray(value) || value.length === 0) {
    return createEmptySlateValue();
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to clone Slate content, using empty value instead.", error);
    return createEmptySlateValue();
  }
};

const hasMeaningfulContent = (value) => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.some((node) => {
    if (!node || typeof node !== "object") {
      return false;
    }

    if (node.type && node.type !== "paragraph") {
      return true;
    }

    if (typeof node.text === "string") {
      return node.text.trim().length > 0;
    }

    if (Array.isArray(node.children)) {
      return node.children.some((child) => {
        if (!child || typeof child !== "object") {
          return false;
        }

        if (child.type && child.type !== "paragraph") {
          return true;
        }

        if (typeof child.text === "string") {
          return child.text.trim().length > 0;
        }

        if (Array.isArray(child.children)) {
          return hasMeaningfulContent([child]);
        }

        return false;
      });
    }

    return false;
  });
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
  const seededRef = useRef(false);
  const cachedInitialValueRef = useRef(cloneSlateValue(initialContent));
  const previousSharedTypeRef = useRef(null);

  if (sharedType && previousSharedTypeRef.current !== sharedType) {
    previousSharedTypeRef.current = sharedType;
    seededRef.current = false;
    cachedInitialValueRef.current = null;
  }

  // Memoize initial value to prevent re-renders
  const initialValue = useMemo(() => {
    if (seededRef.current && cachedInitialValueRef.current) {
      return cachedInitialValueRef.current;
    }

    const clonedValue = cloneSlateValue(initialContent);
    cachedInitialValueRef.current = clonedValue;
    return clonedValue;
  }, [initialContent, sharedType]);

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

  useEffect(() => {
    seededRef.current = false;
  }, [sharedType]);

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

  useEffect(() => {
    if (!editor || !sharedType || seededRef.current) {
      return;
    }

    const sharedTypeIsEmpty = typeof sharedType.length === "number" ? sharedType.length === 0 : sharedType._length === 0;

    if (!sharedTypeIsEmpty) {
      seededRef.current = true;
      return;
    }

    if (!hasMeaningfulContent(initialValue)) {
      seededRef.current = true;
      return;
    }

    Editor.withoutNormalizing(editor, () => {
      for (let i = editor.children.length - 1; i >= 0; i -= 1) {
        Transforms.removeNodes(editor, { at: [i] });
      }

      Transforms.insertNodes(editor, JSON.parse(JSON.stringify(initialValue)), { at: [0] });
    });

    seededRef.current = true;
  }, [editor, sharedType, initialValue]);

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
