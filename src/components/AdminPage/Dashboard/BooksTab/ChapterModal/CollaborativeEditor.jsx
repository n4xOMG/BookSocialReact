import React, { useEffect, useMemo, useState } from "react";
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { editChapterAction, getChapterByRoomId, publishChapterAction } from "../../../../../redux/chapter/chapter.action";
import { useYjs } from "../../../../../hooks/useYjs";
import { processChapterContent, prepareContentForSaving } from "./contentProcessing";
import { EditorHeader } from "./EditorHeader";
import { CollaborativeSlateEditor } from "./CollaborativeSlateEditor";

/**
 * Wrapper component that sets up Liveblocks provider and room
 */
export const CollaborativeEditorWrapper = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();

  // Generate a random color for the user's cursor
  const userColor = useMemo(() => {
    const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }, []);

  useEffect(() => {
    if (!roomId) return;

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
    return (
      <Paper elevation={3} sx={{ p: 4, m: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Room ID is missing!
        </Typography>
      </Paper>
    );
  }

  return (
    <LiveblocksProvider publicApiKey={process.env.REACT_APP_LIVEBLOCK_PUBLIC_KEY}>
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: null,
          user: {
            name: "Anonymous",
            color: userColor,
          },
        }}
      >
        <ClientSideSuspense fallback={<LoadingEditor />}>
          <CollaborativeEditor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

/**
 * Loading component for the editor
 */
const LoadingEditor = () => (
  <Paper elevation={3} sx={{ p: 4, m: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
    <Typography variant="h5">Loading editor...</Typography>
  </Paper>
);

/**
 * Main collaborative editor component
 */
export const CollaborativeEditor = () => {
  const { chapter } = useSelector((store) => store.chapter);
  const [content, setContent] = useState("");
  const [isLoadingChapter, setIsLoadingChapter] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [dialogOpen, setDialogOpen] = useState(false);

  const processedContent = useMemo(() => {
    if (!chapter) return null;
    return processChapterContent(chapter);
  }, [chapter]);

  const { provider, sharedType, connected } = useYjs(processedContent);

  useEffect(() => {
    if (chapter) {
      setIsLoadingChapter(false);
      setContent(processedContent);
    } else {
      setIsLoadingChapter(true);
    }
  }, [chapter, processedContent]);

  const handleSaveDraft = async () => {
    if (content && provider) {
      const jsonContent = prepareContentForSaving(content);
      console.log("Saving draft with content:", content);

      try {
        await dispatch(
          editChapterAction({
            ...chapter,
            content: jsonContent,
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
      const jsonContent = prepareContentForSaving(content);
      console.log("Publishing chapter with content:", content);

      try {
        await dispatch(
          publishChapterAction(chapter.bookId, {
            ...chapter,
            content: jsonContent,
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

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <EditorHeader onSaveDraft={handleSaveDraft} onPublish={handlePublish} onNavigateBack={onNavigateBack} chapterTitle={chapter.title} />

      <CollaborativeSlateEditor
        sharedType={sharedType}
        provider={provider}
        initialContent={content}
        onContentChange={(newContent) => setContent(newContent)}
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
