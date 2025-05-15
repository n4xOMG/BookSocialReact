import { ClientSideSuspense, LiveblocksProvider, RoomProvider, useRoom, useUpdateMyPresence } from "@liveblocks/react";
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
  Paper,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import { withCursors, withYjs, YjsEditor } from "@slate-yjs/core";
import isHotkey from "is-hotkey";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createEditor, Editor, Range, Transforms } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import * as Y from "yjs";
import { BlockButton } from "./TextEditorUtils/BlockButton";
import { Element, Leaf } from "./TextEditorUtils/Element";
import { InsertImageButton } from "./TextEditorUtils/InsertImageHandler";
import { MarkButton, toggleMark } from "./TextEditorUtils/MarkButton";
import { HOTKEYS } from "./TextEditorUtils/ToolbarFunctions";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Cursors } from "./Cursors";
import { editChapterAction, getChapterByRoomId, publishChapterAction } from "../../../../../redux/chapter/chapter.action";
import { deserializeContent, serializeContent } from "../../../../../utils/HtmlSerialize";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DOMPurify from "dompurify";

export const CollaborativeEditorWrapper = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Dispatching getChapterByRoomId with roomId:", roomId);
    dispatch(getChapterByRoomId(roomId))
      .then((result) => {
        console.log("getChapterByRoomId result:", result);
      })
      .catch((error) => {
        console.error("getChapterByRoomId error:", error);
      });
  }, [dispatch, roomId]);

  if (!roomId) {
    return <div>Room ID is missing!</div>;
  }

  return (
    <LiveblocksProvider publicApiKey={process.env.REACT_APP_LIVEBLOCK_PUBLIC_KEY}>
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, user: { name: "Anonymous", color: "#" + Math.floor(Math.random() * 16777215).toString(16) } }}
      >
        <ClientSideSuspense fallback={<LoadingEditor />}>
          <CollaborativeEditor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

const LoadingEditor = () => (
  <Paper elevation={3} sx={{ p: 4, m: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
    <Typography variant="h5">Loading editor...</Typography>
  </Paper>
);

export const CollaborativeEditor = () => {
  const room = useRoom();
  const [connected, setConnected] = useState(false);
  const [sharedType, setSharedType] = useState(null);
  const [provider, setProvider] = useState(null);
  const { chapter } = useSelector((store) => store.chapter);
  const editorRef = useRef(null);

  const [content, setContent] = useState("");
  const [isLoadingChapter, setIsLoadingChapter] = useState(true);
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
      setIsLoadingChapter(false);
      console.log("Initializing Yjs for chapter:", chapter);
      const yDoc = new Y.Doc();
      const parsedContent = chapter.content ? new DOMParser().parseFromString(chapter.content, "text/html") : null;
      const deserialized = parsedContent ? deserializeContent(parsedContent.body) : [{ type: "paragraph", children: [{ text: "" }] }];
      console.log("Deserialized Content:", deserialized);
      setContent(deserialized);
      Y.applyUpdate(yDoc, Y.encodeStateAsUpdate(yDoc));
      const yProvider = new LiveblocksYjsProvider(room, yDoc);
      const sharedDoc = yDoc.get("slate", Y.XmlText);

      yProvider.on("sync", (isSynced) => {
        console.log("Yjs sync status:", isSynced);
        setConnected(isSynced);
      });
      yProvider.on("status", (status) => {
        console.log("Yjs provider status:", status);
      });

      setSharedType(sharedDoc);
      setProvider(yProvider);

      return () => {
        console.log("Cleaning up Yjs provider and document");
        yProvider.off("sync", setConnected);
        if (yProvider && typeof yProvider.destroy === "function") {
          try {
            yProvider.destroy();
          } catch (e) {
            console.warn("Error destroying yProvider:", e);
          }
        }
        if (yDoc && typeof yDoc.destroy === "function") {
          try {
            yDoc.destroy();
          } catch (e) {
            console.warn("Error destroying yDoc:", e);
          }
        }
      };
    } else {
      setIsLoadingChapter(true);
    }
  }, [chapter, room]);

  if (isLoadingChapter) {
    return <LoadingEditor />;
  }

  if (!chapter) {
    return (
      <Paper elevation={3} sx={{ p: 4, m: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error: Chapter data not loaded
        </Typography>
      </Paper>
    );
  }

  if (!connected || !sharedType || !provider) {
    return <LoadingEditor />;
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
          publishChapterAction(chapter.bookId, {
            ...chapter,
            content: serializedContent,
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
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Headbar onSaveDraft={handleSaveDraft} onPublish={handlePublish} onNavigateBack={onNavigateBack} chapterTitle={chapter.title} />
      <SlateEditor
        sharedType={sharedType}
        provider={provider}
        initialContent={content}
        onContentChange={(newContent) => setContent(newContent)}
        editorRef={editorRef}
      />
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

const Headbar = ({ onSaveDraft, onPublish, onNavigateBack, chapterTitle }) => (
  <Paper elevation={2} sx={{ mb: 2 }}>
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "background.paper",
        padding: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton edge="start" color="inherit" aria-label="back" onClick={onNavigateBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
          {chapterTitle || "Untitled Chapter"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onSaveDraft} sx={{ textTransform: "none" }}>
          Save Draft
        </Button>
        <Button variant="contained" color="primary" onClick={onPublish} sx={{ textTransform: "none" }}>
          Publish
        </Button>
      </Box>
    </Toolbar>
  </Paper>
);

const emptyNode = {
  type: "paragraph",
  children: [{ text: "" }],
};

function SlateEditor({ sharedType, provider, initialContent, onContentChange, editorRef }) {
  const updateMyPresence = useUpdateMyPresence();
  const [editorReady, setEditorReady] = useState(false);

  // Memoize the initial value to prevent it from changing on each render
  const initialValue = useMemo(() => {
    return initialContent && initialContent.length > 0 ? initialContent : [emptyNode];
  }, [initialContent]);

  // Create editor instance
  const editor = useMemo(() => {
    // Create the editor with React and Yjs plugins
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
  }, [sharedType, provider.awareness, editorRef]);

  // Connect to Yjs when editor is ready
  useEffect(() => {
    // Connect to Yjs editor
    YjsEditor.connect(editor);

    // Set a small delay to ensure DOM is ready
    const readyTimer = setTimeout(() => {
      setEditorReady(true);
    }, 100);

    return () => {
      // Clean up
      clearTimeout(readyTimer);
      YjsEditor.disconnect(editor);
    };
  }, [editor]);

  // Track content changes with a stable callback
  const handleContentChange = useCallback(
    (value) => {
      // Only send updates for real changes, not just selection changes
      const isAstChange = editor.operations.some((op) => "set_selection" !== op.type);

      if (isAstChange) {
        onContentChange(value);
      }
    },
    [editor, onContentChange]
  );

  // Track and broadcast cursor position
  const handleSelectionChange = useCallback(
    (selection) => {
      if (!selection) return;

      updateMyPresence({
        cursor: selection,
        user: {
          name: "User",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        },
      });
    },
    [updateMyPresence]
  );

  // Set up selection change tracking
  useEffect(() => {
    if (!editorReady) return;

    let el;
    try {
      el = ReactEditor.toDOMNode(editor, editor);
    } catch (err) {
      console.error("Failed to get DOM node:", err);
      return;
    }

    const handleDOMSelectionChange = () => {
      try {
        const domSelection = window.getSelection();
        if (domSelection && domSelection.rangeCount > 0 && ReactEditor.hasDOMNode(editor, domSelection.anchorNode)) {
          const selection = ReactEditor.toSlateRange(editor, domSelection);
          handleSelectionChange(selection);
        }
      } catch (err) {
        console.error("Error in selection tracking:", err);
      }
    };

    document.addEventListener("selectionchange", handleDOMSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleDOMSelectionChange);
    };
  }, [editor, handleSelectionChange, editorReady]);

  // Memoize render functions to prevent unnecessary recreations
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

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
        <Slate editor={editor} initialValue={initialValue} onChange={handleContentChange}>
          <Paper elevation={1} sx={{ mb: 2, p: 0.5, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            <MarkButton format={"bold"} icon={<FormatBoldIcon />} />
            <MarkButton format={"italic"} icon={<FormatItalicIcon />} />
            <MarkButton format={"underline"} icon={<FormatUnderlinedIcon />} />
            <BlockButton format={"left"} icon={<FormatAlignLeftIcon />} />
            <BlockButton format={"center"} icon={<FormatAlignCenterIcon />} />
            <BlockButton format={"right"} icon={<FormatAlignRightIcon />} />
            <BlockButton format={"justify"} icon={<FormatAlignJustifyIcon />} />
            <InsertImageButton />
          </Paper>

          {editorReady ? (
            <Cursors editorRef={editorRef}>
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
}
