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
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { useYjs } from "../../../../../hooks/useYjs";
import { editChapterAction, getChapterByRoomId, publishChapterAction } from "../../../../../redux/chapter/chapter.action";
import { buildPresenceUser } from "../../../../../utils/presenceUtils";
import { CollaborativeSlateEditor } from "./CollaborativeSlateEditor";
import { prepareContentForSaving, processChapterContent } from "./contentProcessing";
import { EditorHeader } from "./EditorHeader";

/**
 * Wrapper component that sets up Liveblocks provider and room
 */
export const CollaborativeEditorWrapper = () => {
  const { roomId } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const presenceUser = useMemo(() => buildPresenceUser(currentUser), [currentUser]);

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
          user: presenceUser,
        }}
      >
        <ClientSideSuspense fallback={<LoadingEditor />}>
          {() => <CollaborativeEditor presenceUser={presenceUser} roomId={roomId} />}
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
export const CollaborativeEditor = ({ presenceUser, roomId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chapter } = useSelector((store) => store.chapter);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const [isLoadingChapter, setIsLoadingChapter] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

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
    if (!roomId) {
      setLoadError("Room ID is missing.");
      setIsLoadingChapter(false);
      return;
    }

    let isMounted = true;
    setIsLoadingChapter(true);
    setLoadError(null);

    dispatch(getChapterByRoomId(roomId))
      .then((result) => {
        if (!isMounted) return;
        if (result?.error) {
          setLoadError(result.error);
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        setLoadError(error?.message || "Failed to load chapter.");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoadingChapter(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, roomId]);

  useEffect(() => {
    if (chapter) {
      setContent(processedContent);
      setIsLoadingChapter(false);
    }
  }, [chapter, processedContent]);

  const chapterAuthorId = useMemo(() => {
    if (!chapter) return null;
    return chapter.authorId;
  }, [chapter]);

  const isAdmin = useMemo(() => {
    const roleName = currentUser?.role?.name;
    if (!roleName) return false;
    return roleName.toString().toUpperCase().includes("ADMIN");
  }, [currentUser?.role?.name]);

  const canManageChapter = useMemo(() => {
    if (isAdmin) return true;
    if (!currentUser?.id || !chapterAuthorId) return false;
    return String(currentUser.id) === String(chapterAuthorId);
  }, [isAdmin, currentUser?.id, chapterAuthorId]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}/edit-chapter/${roomId}`;
  }, [roomId]);

  const handleSaveDraft = async () => {
    if (content && provider) {
      if (!canManageChapter) {
        setSnackbarMessage("Only the chapter author can save drafts.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      if (!chapter?.id) {
        setSnackbarMessage("Chapter data is not available yet.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      setIsSaving(true);
      const jsonContent = prepareContentForSaving(content);

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
        // Handle backend permission errors
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to save draft.";
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Save draft error:", error);
      } finally {
        setIsSaving(false);
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
      if (!canManageChapter) {
        setSnackbarMessage("Only the chapter author can publish chapters.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      if (!chapter?.id) {
        setSnackbarMessage("Chapter data is not available yet.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      setIsPublishing(true);
      const jsonContent = prepareContentForSaving(content);

      try {
        const bookId = chapter.bookId || chapter.book?.id;

        if (!bookId) {
          throw new Error("Missing book identifier for chapter.");
        }

        await dispatch(
          publishChapterAction(bookId, {
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
        // Handle backend permission errors
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to publish chapter.";
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Publish chapter error:", error);
      } finally {
        setIsPublishing(false);
      }
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: chapter?.title || "Chapter",
          url: shareUrl,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setSnackbarMessage("Link copied to clipboard.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        throw new Error("Share not supported");
      }
    } catch (error) {
      setSnackbarMessage("Unable to share link automatically.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
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

  if (loadError) {
    return (
      <Paper elevation={3} sx={{ p: 4, m: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {loadError}
        </Typography>
      </Paper>
    );
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
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <EditorHeader
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onNavigateBack={onNavigateBack}
        onShare={handleShare}
        chapterTitle={chapter.title}
        canManageChapter={canManageChapter}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />

      {!canManageChapter && (
        <Alert severity="info" sx={{ mx: 2, mb: 2, flexShrink: 0 }}>
          You can participate in editing, but only the chapter author can save drafts or publish changes.
        </Alert>
      )}

      {/* Scrollable editor container - takes remaining height */}
      <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <CollaborativeSlateEditor
          sharedType={sharedType}
          provider={provider}
          initialContent={content}
          onContentChange={(newContent) => setContent(newContent)}
          presenceUser={presenceUser}
        />
      </Box>

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
