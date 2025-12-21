import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography } from "@mui/material";
import { Block, GppBad } from "@mui/icons-material";

const AccountRestrictionAlert = ({ open, handleClose, message, isBanned, isSuspended }) => {
  const getTitle = () => {
    if (isBanned) return "Account Banned";
    if (isSuspended) return "Account Suspended";
    return "Account Restricted";
  };

  const getIcon = () => {
    if (isBanned) return <Block sx={{ fontSize: 48, color: "error.main" }} />;
    if (isSuspended) return <GppBad sx={{ fontSize: 48, color: "warning.main" }} />;
    return <Block sx={{ fontSize: 48, color: "error.main" }} />;
  };

  const getDefaultMessage = () => {
    if (isBanned) return "Your account has been permanently banned. Please contact the administrator for more information.";
    if (isSuspended) return "Your account has been temporarily suspended. You cannot perform certain actions until the suspension is lifted. Contact support for assistance.";
    return "Your account has been restricted. Please contact support for more information.";
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="account-restriction-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="account-restriction-dialog-title">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {getIcon()}
          <Typography variant="h5" component="span" fontWeight={600}>
            {getTitle()}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: "1rem", lineHeight: 1.6 }}>
          {message || getDefaultMessage()}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          color={isBanned ? "error" : "warning"}
          fullWidth
        >
          I Understand
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountRestrictionAlert;
