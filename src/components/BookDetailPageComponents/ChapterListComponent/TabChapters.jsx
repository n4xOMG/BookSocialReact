import UnlockIcon from "@mui/icons-material/LockOpen";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { memo, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllChaptersByBookIdAction, unlockChapterAction } from "../../../redux/chapter/chapter.action";
import { isTokenExpired } from "../../../utils/useAuthCheck";

export const TabChapters = memo(function TabChapters({ chapters, progresses, onNavigate, bookId }) {
  const dispatch = useDispatch();
  const jwt = isTokenExpired(localStorage.getItem("jwt")) ? null : localStorage.getItem("jwt");
  const { user } = useSelector((state) => state.auth);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [error, setError] = useState("");
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // Optimize progress lookup: O(N) -> O(1)
  const progressMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(progresses)) {
      progresses.forEach((p) => {
        const chapterId = p?.chapterId || p?.chapter?.id;
        if (chapterId) {
          map.set(String(chapterId).toLowerCase(), p);
        }
      });
    }
    return map;
  }, [progresses]);

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
      handleDialogClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to unlock chapter.");
    }
  };

  return (
    <>
      <List sx={{ spaceY: isMobile ? 1 : 2 }}>
        {chapters?.map((chapter) => {
          const progress = progressMap.get(String(chapter.id).toLowerCase());

          const rawProgress = progress?.progress;
          const numericProgress = typeof rawProgress === "number" ? rawProgress : parseFloat(rawProgress);
          const progressValue = Number.isFinite(numericProgress) ? Math.min(Math.max(numericProgress, 0), 100) : 0;

          const isLocked = chapter?.locked && !chapter?.unlockedByUser && chapter?.price > 0;

          return (
            <ListItem
              key={chapter.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: isMobile ? 1 : 2,
                mb: 1,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                height: 60,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 8px 8px 0 rgba(0, 0, 0, 0.37)",
                bgcolor: isLocked ? "background.paper" : "action.notselect",
                "&:hover": {
                  backgroundColor: isLocked ? "grey.100" : "action.hover",
                  boxShadow: 2,
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
                    {`${progressValue.toFixed(0)}%`}
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
});
