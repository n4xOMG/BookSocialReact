// src/components/UserBooks/ChapterList.jsx

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

const ChapterList = ({ chapters, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!chapters || chapters.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No chapters available.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader aria-label="chapters table">
        <TableHead>
          <TableRow>
            <TableCell>Chapter No.</TableCell>
            <TableCell>Title</TableCell>
            {!isMobile && <TableCell>Upload Date</TableCell>}
            {!isMobile && <TableCell>Price</TableCell>}
            {!isMobile && <TableCell>Locked</TableCell>}
            {!isMobile && <TableCell>Views</TableCell>}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chapters.map((chapter) => (
            <TableRow key={chapter.id} hover>
              <TableCell>{chapter.chapterNum}</TableCell>
              <TableCell>
                <Typography variant="subtitle1">{chapter.title}</Typography>
              </TableCell>
              {!isMobile && <TableCell>{new Date(chapter.uploadDate).toLocaleDateString()}</TableCell>}
              {!isMobile && <TableCell>${chapter.price}</TableCell>}
              {!isMobile && (
                <TableCell>
                  {chapter.locked ? (
                    <Tooltip title="Locked">
                      <LockIcon color="error" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Unlocked">
                      <LockOpenIcon color="success" />
                    </Tooltip>
                  )}
                </TableCell>
              )}
              {!isMobile && <TableCell>{chapter.viewCount}</TableCell>}
              <TableCell align="center">
                <Tooltip title="View Chapter">
                  <IconButton
                    color="info"
                    onClick={() => {
                      // Implement view functionality if necessary
                      // For example, navigate to the chapter's content
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Chapter">
                  <IconButton color="primary" onClick={() => onEdit(chapter)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Chapter">
                  <IconButton color="error" onClick={() => onDelete(chapter)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ChapterList;
