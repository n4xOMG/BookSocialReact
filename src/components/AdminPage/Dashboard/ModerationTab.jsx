import { Approve, Delete, Flag } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const ModerationTab = () => {
  const [pendingContent, setPendingContent] = useState([]);
  const [openFlag, setOpenFlag] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [flagReason, setFlagReason] = useState("");

  useEffect(() => {
    loadPendingContent();
  }, []);

  const loadPendingContent = async () => {
    const data = await fetchPendingContent();
    setPendingContent(data);
  };

  const handleApprove = async (id) => {
    await approveContent(id);
    loadPendingContent();
  };

  const handleFlagOpen = (content) => {
    setSelectedContent(content);
    setFlagReason("");
    setOpenFlag(true);
  };

  const handleFlagClose = () => {
    setSelectedContent(null);
    setFlagReason("");
    setOpenFlag(false);
  };

  const handleFlagSubmit = async () => {
    await flagContent(selectedContent.id, flagReason);
    handleFlagClose();
    loadPendingContent();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      await deleteContent(id);
      loadPendingContent();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Content Moderation
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Content Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Submitted By</TableCell>
              <TableCell>Date Submitted</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingContent.map((content) => (
              <TableRow key={content.id}>
                <TableCell>{content.type}</TableCell>
                <TableCell>{content.title}</TableCell>
                <TableCell>{content.submittedBy}</TableCell>
                <TableCell>{new Date(content.dateSubmitted).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Approve">
                    <IconButton color="success" onClick={() => handleApprove(content.id)}>
                      <Approve />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Flag">
                    <IconButton color="warning" onClick={() => handleFlagOpen(content)}>
                      <Flag />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(content.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Flag Content Dialog */}
      <Dialog open={openFlag} onClose={handleFlagClose}>
        <DialogTitle>Flag Content</DialogTitle>
        <DialogContent>
          <Typography>
            Provide a reason for flagging: <strong>{selectedContent?.title}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Flag Reason"
            fullWidth
            multiline
            rows={4}
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFlagClose}>Cancel</Button>
          <Button onClick={handleFlagSubmit} variant="contained" color="warning">
            Flag
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModerationTab;
