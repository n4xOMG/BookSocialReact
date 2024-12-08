import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import UnlockIcon from "@mui/icons-material/LockOpen";
import { getAllChaptersByBookIdAction, unlockChapterAction } from "../../../redux/chapter/chapter.action";
import { isTokenExpired } from "../../../utils/useAuthCheck";

export function TabChapters({ chapters, progresses, onNavigate, bookId }) {
  const dispatch = useDispatch();
  const jwt = isTokenExpired(localStorage.getItem("jwt")) ? null : localStorage.getItem("jwt");
  const { user } = useSelector((state) => state.auth);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [error, setError] = useState("");

  const handleUnlockClick = (chapter) => {
    setSelectedChapter(chapter);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedChapter(null);
    setError("");
  };

  const handleConfirmUnlock = async () => {
    if (!selectedChapter) return;

    try {
      await dispatch(unlockChapterAction(selectedChapter.id));
      await dispatch(getAllChaptersByBookIdAction(jwt, bookId));
      // Optionally, update the UI without reloading
      handleDialogClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to unlock chapter.");
    }
  };

  return (
    <>
      <List sx={{ spaceY: 2 }}>
        {chapters?.map((chapter) => {
          const progress = Array.isArray(progresses) ? progresses.find((p) => Number(p.chapterId) === Number(chapter.id)) : null;

          const isLocked = chapter?.locked && !chapter?.unlockedByUser && chapter?.price > 0;

          return (
            <ListItem
              key={chapter.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                height: 60,
                backgroundColor: isLocked ? "grey.100" : "white",
                "&:hover": {
                  backgroundColor: isLocked ? "grey.100" : "grey.200",
                  boxShadow: 3,
                  transform: "scale(1.02)",
                  cursor: isLocked ? "default" : "pointer",
                },
              }}
              onClick={() => {
                if (!isLocked) {
                  onNavigate(`/books/${bookId}/chapters/${chapter.id}`);
                }
              }}
            >
              <ListItemText primary={`Ch.${chapter.chapterNum} ${chapter.title}`} />
              <div>
                {isLocked ? (
                  <>
                    <Tooltip title={`Unlock for ${chapter.price} credits`}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering onClick of ListItem
                          handleUnlockClick(chapter);
                        }}
                        disabled={!user || (user && user.credits < chapter.price)}
                      >
                        <UnlockIcon color={user && user.credits >= chapter.price ? "primary" : "disabled"} />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2" color="textSecondary">
                      {chapter.price} credits
                    </Typography>
                  </>
                ) : (
                  // Display progress or other indicators for unlocked chapters
                  <Typography variant="body2" color="textSecondary">
                    {progress ? `${progress.progress.toFixed(2)}%` : "0%"}
                  </Typography>
                )}
              </div>
            </ListItem>
          );
        })}
      </List>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Unlock Chapter</DialogTitle>
        <DialogContent>
          {!user && (
            <DialogContentText>
              You need to <strong>log in</strong> or <strong>sign up</strong> to unlock this chapter.
            </DialogContentText>
          )}

          {user && (
            <DialogContentText>
              This chapter is locked and requires <strong>{selectedChapter?.price} credits</strong> to unlock. Would you like to proceed?
            </DialogContentText>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUnlock} color="primary" variant="contained">
            Unlock
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
