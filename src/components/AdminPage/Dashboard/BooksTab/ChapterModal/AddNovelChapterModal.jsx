import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import LockIcon from "@mui/icons-material/Lock";
import {
  alpha,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addDraftChapterAction, getChapterByRoomId } from "../../../../../redux/chapter/chapter.action";

export default function AddNovelChapterModal({ open, onClose, bookId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState({
    chapterNum: "",
    title: "",
    price: 0,
    locked: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChapterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLockedChange = (e) => {
    const isLocked = e.target.checked;
    setChapterData((prev) => ({
      ...prev,
      locked: isLocked,
      price: isLocked && prev.price === 0 ? 10 : prev.price,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const savedChapter = await dispatch(addDraftChapterAction(bookId, chapterData));
      setLoading(false);
      // Redirect to collaborative editor page with roomId
      if (savedChapter?.payload?.roomId) {
        dispatch(getChapterByRoomId(savedChapter.payload.roomId)).then(() => {
          navigate(`/edit-chapter/${savedChapter.payload.roomId}`);
        });
      } else {
        onClose();
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const canSubmit = chapterData.chapterNum && chapterData.title;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          backdropFilter: "blur(20px)",
          background: theme.palette.mode === "dark" ? "rgba(26, 38, 52, 0.9)" : "rgba(255, 255, 255, 0.85)",
          boxShadow: theme.palette.mode === "dark" ? "0 24px 48px rgba(0, 0, 0, 0.5)" : "0 24px 48px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          pt: 4,
          pb: 2,
          px: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
              background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            New Chapter
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 24, height: 2, bgcolor: theme.palette.secondary.main, borderRadius: 1 }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500, letterSpacing: 0.5 }}>
              NOVEL DRAFT
            </Typography>
          </Stack>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            backdropFilter: "blur(4px)",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              transform: "rotate(90deg)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ display: "block", mb: 2, letterSpacing: 1 }}>
              Chapter Details
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                name="chapterNum"
                label="Chapter Number"
                placeholder="e.g., 1"
                value={chapterData.chapterNum}
                onChange={handleChange}
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    borderRadius: "16px",
                    bgcolor: alpha(theme.palette.background.paper, 0.4),
                    border: "1px solid",
                    borderColor: "transparent",
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: alpha(theme.palette.background.paper, 0.6) },
                    "&.Mui-focused": {
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
                InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
              />
              <TextField
                required
                fullWidth
                name="title"
                label="Chapter Title"
                placeholder="e.g., The Journey Begins"
                value={chapterData.title}
                onChange={handleChange}
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    borderRadius: "16px",
                    bgcolor: alpha(theme.palette.background.paper, 0.4),
                    border: "1px solid",
                    borderColor: "transparent",
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: alpha(theme.palette.background.paper, 0.6) },
                    "&.Mui-focused": {
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
                InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ display: "block", mb: 2, letterSpacing: 1 }}>
              Settings
            </Typography>
            <Stack spacing={2.5}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: chapterData.locked ? theme.palette.primary.main : alpha(theme.palette.divider, 0.5),
                  bgcolor: chapterData.locked ? alpha(theme.palette.primary.main, 0.05) : "transparent",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => handleLockedChange({ target: { checked: !chapterData.locked } })}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <LockIcon
                      fontSize="small"
                      sx={{ color: chapterData.locked ? theme.palette.primary.main : theme.palette.text.disabled }}
                    />
                    <Typography variant="subtitle2" fontWeight={600} color={chapterData.locked ? "primary" : "text.secondary"}>
                      Premium Chapter
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {chapterData.locked ? "Readers pay credits to unlock" : "Free for everyone to read"}
                  </Typography>
                </Box>
                <Switch checked={chapterData.locked} onChange={handleLockedChange} color="primary" size="small" />
              </Paper>

              <Box
                sx={{
                  height: chapterData.locked ? "auto" : 0,
                  overflow: "hidden",
                  opacity: chapterData.locked ? 1 : 0,
                  transition: "all 0.3s ease",
                }}
              >
                <TextField
                  label="Price (Credits)"
                  name="price"
                  type="number"
                  variant="filled"
                  value={chapterData.price}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    inputProps: { min: 0 },
                    sx: {
                      borderRadius: "16px",
                      bgcolor: alpha(theme.palette.background.paper, 0.4),
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>
                          ©
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            color: theme.palette.text.secondary,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !canSubmit}
          startIcon={<CreateIcon />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            color: "white",
            px: 4,
            py: 1.2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: "translateY(-1px)",
            },
          }}
        >
          Create & Start Writing
        </Button>
      </DialogActions>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(5px)",
          bgcolor: "rgba(0,0,0,0.5)",
          flexDirection: "column",
          gap: 2,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="body1" fontWeight={600}>
          Creating Draft...
        </Typography>
      </Backdrop>
    </Dialog>
  );
}
