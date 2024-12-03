import { ClientSideSuspense, LiveblocksProvider, RoomProvider, useOthers, useRoom, useUpdateMyPresence } from "@liveblocks/react";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Toolbar,
} from "@mui/material";
import { withCursors, withYjs, YjsEditor } from "@slate-yjs/core";
import isHotkey from "is-hotkey";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createEditor, Editor, Transforms } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import * as Y from "yjs";
import { BlockButton } from "./TextEditorUtils/BlockButton";
import { Element, Leaf } from "./TextEditorUtils/Element";
import { InsertImageButton } from "./TextEditorUtils/InsertImageHandler";
import { MarkButton, toggleMark } from "./TextEditorUtils/MarkButton";
import { HOTKEYS } from "./TextEditorUtils/ToolbarFunctions";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Cursors } from "./Cursors";
import { editChapterAction, getChapterByRoomId } from "../../../../../redux/chapter/chapter.action";
import { deserializeContent, serializeContent } from "../../../../../utils/HtmlSerialize";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DOMPurify from "dompurify";
export const CollaborativeEditorWrapper = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getChapterByRoomId(roomId));
  }, [roomId]);
  if (!roomId) {
    return <div>Room ID is missing!</div>;
  }

  return (
    <LiveblocksProvider publicApiKey={process.env.REACT_APP_LIVEBLOCK_PUBLIC_KEY}>
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <CollaborativeEditor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export const CollaborativeEditor = () => {
  const room = useRoom();
  const [connected, setConnected] = useState(false);
  const [sharedType, setSharedType] = useState(null);
  const [provider, setProvider] = useState(null);
  const { chapter } = useSelector((store) => store.chapter);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Confirmation Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (chapter) {
      // Initialize the Yjs document and provider
      const yDoc = new Y.Doc();
      const parsedContent = chapter.content ? new DOMParser().parseFromString(chapter.content, "text/html") : null;
      const deserialized = parsedContent ? deserializeContent(parsedContent.body) : [{ text: "" }];
      console.log("Deserialized Content:", deserialized);
      setContent(deserialized);
      Y.applyUpdate(yDoc, Y.encodeStateAsUpdate(yDoc));
      const yProvider = new LiveblocksYjsProvider(room, yDoc);
      const sharedDoc = yDoc.get("slate", Y.XmlText);

      // Sync connection status
      yProvider.on("sync", setConnected);

      // Set up shared type and provider
      setSharedType(sharedDoc);
      setProvider(yProvider);

      // Cleanup function
      return () => {
        yProvider.off("sync", setConnected); // Remove sync listener
        yProvider.destroy(); // Destroy provider
        yDoc.destroy(); // Destroy Yjs document
      };
    }
  }, [chapter, room]);

  if (!connected || !sharedType || !provider) {
    return <div>Loading…</div>;
  }
  const handleSaveDraft = async () => {
    if (content && provider) {
      const serializedContent = serializeContent(content);
      console.log("Content:", content);
      console.log("Serialized Content:", serializedContent);
      try {
        await dispatch(
          editChapterAction(chapter.bookId, {
            ...chapter,
            content: DOMPurify.sanitize(serializedContent),
            draft: true,
          })
        );
        setSnackbarMessage("Draft saved successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } catch (error) {
        console.error("Error saving draft:", error);
        setSnackbarMessage("Failed to save draft.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handlePublish = () => {
    setDialogOpen(true);
  };
  const cancelPublish = () => {
    setDialogOpen(false);
  };
  const confirmPublish = async () => {
    setDialogOpen(false);
    if (content && provider) {
      const serializedContent = serializeContent(content);
      console.log("Content:", content);
      console.log("Serialized Content:", serializedContent);
      try {
        await dispatch(
          editChapterAction(chapter.bookId, {
            ...chapter,
            content: serializedContent,
            draft: false,
          })
        );
        setSnackbarMessage("Chapter published successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } catch (error) {
        console.error("Error publishing chapter:", error);
        setSnackbarMessage("Failed to publish chapter.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };
  const onNavigateBack = () => {
    navigate(-1);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <Box>
      <Headbar onSaveDraft={handleSaveDraft} onPublish={handlePublish} onNavigateBack={onNavigateBack} />
      <SlateEditor
        sharedType={sharedType}
        provider={provider}
        initialContent={content}
        onContentChange={(newContent) => setContent(newContent)}
      />
      ;
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/* Confirmation Dialog for Publish */}
      <Dialog open={dialogOpen} onClose={cancelPublish}>
        <DialogTitle>Confirm Publish</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to publish this chapter? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelPublish} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmPublish} color="primary" variant="contained">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
const Headbar = ({ onSaveDraft, onPublish, onNavigateBack }) => (
  <Toolbar
    sx={{
      display: "flex",
      justifyContent: "flex-start",
      gap: 2,
      backgroundColor: "background.paper",
      boxShadow: 1,
      padding: 2,
    }}
  >
    <IconButton edge="start" color="inherit" aria-label="back" onClick={onNavigateBack} sx={{ mr: 2 }}>
      <ArrowBackIcon />
    </IconButton>
    <Button variant="contained" color="secondary" onClick={onSaveDraft} sx={{ textTransform: "none" }}>
      Save Draft
    </Button>
    <Button variant="contained" color="primary" onClick={onPublish} sx={{ textTransform: "none" }}>
      Publish
    </Button>
  </Toolbar>
);
const emptyNode = {
  children: [{ text: "" }],
};
function SlateEditor({ sharedType, provider, initialContent, onContentChange }) {
  useEffect(() => {
    console.log("SlateEditor Props:", { sharedType, provider, initialContent });
  }, []);
  const editor = useMemo(() => {
    // Create the editor with React and Yjs plugins
    const e = withReact(withCursors(withYjs(createEditor(), sharedType), provider.awareness));

    // Ensure the editor always has at least one valid child
    const { normalizeNode } = e;
    e.normalizeNode = (entry) => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }
      if (initialContent.length > 0) {
        Transforms.insertNodes(e, initialContent, { at: [0] });
      }
      Transforms.insertNodes(e, emptyNode, { at: [0] });
    };

    return e;
  }, [sharedType]);

  useEffect(() => {
    // Connect to Yjs editor
    YjsEditor.connect(editor);
    return () => {
      // Disconnect when the component unmounts
      YjsEditor.disconnect(editor);
    };
  }, [editor]);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "12px",
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
        color: "#111827",
      }}
    >
      <Box
        sx={{
          position: "relative",
          padding: "1em",
          height: "100%",
        }}
      >
        <Slate editor={editor} initialValue={initialContent.length > 0 ? initialContent : [emptyNode]} onChange={onContentChange}>
          <Cursors>
            <Toolbar>
              <MarkButton format={"bold"} icon={<FormatBoldIcon />} />
              <MarkButton format={"italic"} icon={<FormatItalicIcon />} />
              <MarkButton format={"underline"} icon={<FormatUnderlinedIcon />} />
              <BlockButton format={"left"} icon={<FormatAlignLeftIcon />} />
              <BlockButton format={"center"} icon={<FormatAlignCenterIcon />} />
              <BlockButton format={"right"} icon={<FormatAlignRightIcon />} />
              <BlockButton format={"justify"} icon={<FormatAlignJustifyIcon />} />
              <InsertImageButton />
            </Toolbar>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter some text..."
              onKeyDown={(event) => {
                for (const hotkey in HOTKEYS) {
                  if (isHotkey(hotkey, event)) {
                    event.preventDefault();
                    const mark = HOTKEYS[hotkey];
                    toggleMark(editor, mark);
                  }
                }
              }}
            />
          </Cursors>
        </Slate>
      </Box>
    </Box>
  );
}
