import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { Block, GppBad, CheckCircle } from "@mui/icons-material";

const BanSuspendUserDialog = ({ open, handleClose, handleAction, user }) => {
  const [actionType, setActionType] = useState("suspend"); // 'suspend', 'ban', 'unsuspend', 'unban'
  const [banReason, setBanReason] = useState("");

  const isBanned = user?.banned || user?.isBanned;
  const isSuspended = user?.isSuspended;

  const handleSubmit = () => {
    handleAction(user.id, actionType, banReason);
    setBanReason("");
    setActionType("suspend");
  };

  const handleDialogClose = () => {
    setBanReason("");
    setActionType("suspend");
    handleClose();
  };

  const getCurrentStatus = () => {
    if (isBanned) return { label: "Banned", color: "error", icon: <Block /> };
    if (isSuspended) return { label: "Suspended", color: "warning", icon: <GppBad /> };
    return { label: "Active", color: "success", icon: <CheckCircle /> };
  };

  const status = getCurrentStatus();

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage User Status</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            User: <strong>{user?.username}</strong>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Typography variant="body2">Current Status:</Typography>
            <Chip label={status.label} color={status.color} size="small" icon={status.icon} />
          </Box>
        </Box>

        <DialogContentText sx={{ mb: 2 }}>
          Select an action to apply to this user:
        </DialogContentText>

        <FormControl component="fieldset">
          <RadioGroup
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            {!isSuspended && !isBanned && (
              <>
                <FormControlLabel
                  value="suspend"
                  control={<Radio color="warning" />}
                  label="Suspend User (Temporary restriction)"
                />
                <FormControlLabel
                  value="ban"
                  control={<Radio color="error" />}
                  label="Ban User (Permanent restriction)"
                />
              </>
            )}
            {isSuspended && (
              <FormControlLabel
                value="unsuspend"
                control={<Radio color="success" />}
                label="Lift Suspension (Restore access)"
              />
            )}
            {isBanned && (
              <FormControlLabel
                value="unban"
                control={<Radio color="success" />}
                label="Lift Ban (Restore access)"
              />
            )}
          </RadioGroup>
        </FormControl>

        {actionType === "ban" && (
          <TextField
            fullWidth
            label="Ban Reason"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            multiline
            rows={3}
            margin="normal"
            placeholder="Please provide a reason for banning this user..."
            required
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={actionType === "ban" || actionType === "suspend" ? "warning" : "success"}
          disabled={actionType === "ban" && !banReason.trim()}
        >
          {actionType === "suspend" && "Suspend"}
          {actionType === "ban" && "Ban"}
          {actionType === "unsuspend" && "Lift Suspension"}
          {actionType === "unban" && "Lift Ban"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BanSuspendUserDialog;
