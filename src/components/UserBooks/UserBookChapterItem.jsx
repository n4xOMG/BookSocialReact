import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, IconButton, Tooltip, Typography, useTheme, Chip, Stack } from "@mui/material";
import React from "react";
import { formatExactTime } from "../../utils/formatDate";

export const UserBookChapterItem = React.memo(({ chapter, onEdit, onDelete, style }) => {
  const theme = useTheme();

  return (
    <Box style={style} sx={{ px: 2, py: 0.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
          borderRadius: "8px",
          bgcolor: theme.palette.background.paper,
          border: "1px solid",
          borderColor: theme.palette.divider,
          transition: "all 0.2s ease",
          height: "100%",
          boxSizing: "border-box",
          "&:hover": {
            bgcolor: theme.palette.action.hover,
            borderColor: theme.palette.primary.light,
            transform: "translateX(4px)",
            "& .actions": { opacity: 1 },
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              variant="subtitle1"
              className="font-serif"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: theme.palette.text.primary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Chapter {chapter.chapterNum}: {chapter.title || "Untitled"}
            </Typography>
            
            {chapter.isPremium && (
              <LockIcon sx={{ fontSize: 16, color: theme.palette.secondary.main }} />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
               <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
               <Typography variant="caption" color="text.secondary">
                 {formatExactTime(chapter.updatedAt)}
               </Typography>
            </Box>
            
            {chapter.status === "DRAFT" && (
               <Chip 
                 label="Draft" 
                 size="small" 
                 sx={{ 
                   height: 16, 
                   fontSize: "0.65rem", 
                   bgcolor: theme.palette.warning.light, 
                   color: theme.palette.warning.contrastText 
                 }} 
               />
            )}
          </Box>
        </Box>

        <Stack 
          direction="row" 
          className="actions"
          spacing={0.5} 
          sx={{ 
            opacity: 0, 
            transition: "opacity 0.2s",
            ml: 2
          }}
        >
          <Tooltip title="View">
            <IconButton size="small" sx={{ "&:hover": { color: theme.palette.primary.main } }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(chapter)} sx={{ "&:hover": { color: theme.palette.info.main } }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(chapter)} sx={{ "&:hover": { color: theme.palette.error.main } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
});
