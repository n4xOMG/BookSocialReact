import { useCallback, useEffect, useRef, useState } from "react";
import { useUpdateMyPresence } from "@liveblocks/react";
import { ReactEditor } from "slate-react";

/**
 * Custom hook for managing collaboration presence (cursor position, user info)
 * @param {Object} editor - Slate editor instance
 * @param {boolean} editorReady - Whether the editor is ready
 * @returns {Object} - Presence management functions
 */
export const useCollaborationPresence = (editor, editorReady) => {
  const updateMyPresence = useUpdateMyPresence();
  const [userName] = useState(`User-${Math.floor(Math.random() * 10000)}`);
  const userColorRef = useRef("#" + Math.floor(Math.random() * 16777215).toString(16));
  const editorDomRef = useRef(null);

  // Initialize presence
  useEffect(() => {
    if (!editorReady) return;

    updateMyPresence({
      cursor: null,
      selection: null,
      user: {
        name: userName,
        color: userColorRef.current,
      },
    });
  }, [editorReady, updateMyPresence, userName]);

  // Store editor DOM reference
  useEffect(() => {
    if (!editorReady || !editor) return;

    try {
      const editorDomNode = ReactEditor.toDOMNode(editor, editor);
      editorDomRef.current = editorDomNode;
      console.log("Editor DOM node stored:", !!editorDomNode);
    } catch (err) {
      console.error("Failed to get editor DOM node:", err);
    }
  }, [editorReady, editor]);

  // Set up mouse tracking
  useEffect(() => {
    if (!editorReady || !editorDomRef.current) return;

    const editorElement = editorDomRef.current;

    const handleMouseMove = (e) => {
      const rect = editorElement.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);

      updateMyPresence({
        cursor: { x, y },
        user: { name: userName, color: userColorRef.current },
      });
    };

    const handleMouseLeave = () => {
      updateMyPresence({
        cursor: null,
        user: { name: userName, color: userColorRef.current },
      });
    };

    editorElement.addEventListener("mousemove", handleMouseMove);
    editorElement.addEventListener("mouseleave", handleMouseLeave);

    console.log("Added mouse tracking to editor");

    return () => {
      editorElement.removeEventListener("mousemove", handleMouseMove);
      editorElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [editorReady, updateMyPresence, userName]);

  // Update selection presence
  const updateSelection = useCallback(() => {
    if (editor && editor.selection) {
      updateMyPresence((prevPresence) => ({
        ...prevPresence,
        selection: editor.selection,
      }));
    }
  }, [editor, updateMyPresence]);

  return {
    userName,
    userColor: userColorRef.current,
    editorDomRef,
    updateSelection,
  };
};
