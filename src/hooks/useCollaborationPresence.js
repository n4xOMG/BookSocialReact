import { useCallback, useEffect, useRef, useState } from "react";
import { useUpdateMyPresence } from "@liveblocks/react";
import { ReactEditor } from "slate-react";
import { buildPresenceUser } from "../utils/presenceUtils";

/**
 * Custom hook for managing collaboration presence (cursor position, user info)
 * @param {Object} editor - Slate editor instance
 * @param {boolean} editorReady - Whether the editor is ready
 * @param {Object} presenceUser - User details to broadcast
 * @returns {Object} - Presence management functions
 */
export const useCollaborationPresence = (editor, editorReady, presenceUser) => {
  const updateMyPresence = useUpdateMyPresence();
  const [fallbackUser] = useState(() => buildPresenceUser());
  const presenceRef = useRef(buildPresenceUser(presenceUser || fallbackUser));
  const editorDomRef = useRef(null);

  useEffect(() => {
    if (!presenceUser) {
      return;
    }

    presenceRef.current = buildPresenceUser(presenceUser);

    updateMyPresence((prevPresence) => ({
      ...prevPresence,
      user: presenceRef.current,
    }));
  }, [presenceUser, updateMyPresence]);

  // Initialize presence
  useEffect(() => {
    if (!editorReady) return;

    updateMyPresence({
      cursor: null,
      selection: null,
      user: presenceRef.current,
    });
  }, [editorReady, updateMyPresence]);

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
        user: presenceRef.current,
      });
    };

    const handleMouseLeave = () => {
      updateMyPresence({
        cursor: null,
        user: presenceRef.current,
      });
    };

    editorElement.addEventListener("mousemove", handleMouseMove);
    editorElement.addEventListener("mouseleave", handleMouseLeave);

    console.log("Added mouse tracking to editor");

    return () => {
      editorElement.removeEventListener("mousemove", handleMouseMove);
      editorElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [editorReady, updateMyPresence]);

  // Update selection presence
  const updateSelection = useCallback(() => {
    if (editor && editor.selection) {
      updateMyPresence((prevPresence) => ({
        ...prevPresence,
        selection: editor.selection,
        user: presenceRef.current,
      }));
    }
  }, [editor, updateMyPresence]);

  return {
    editorDomRef,
    updateSelection,
  };
};
