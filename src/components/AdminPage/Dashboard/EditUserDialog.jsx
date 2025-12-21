import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  MenuItem,
  Box,
  Typography
} from "@mui/material";

const GENDERS = ["MALE", "FEMALE", "OTHER"];

const EditUserDialog = ({ open, handleClose, handleUpdate, user }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    bio: "",
    gender: "",
    credits: 0,
    isVerified: false,
    isSuspended: false,
    birthdate: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        gender: user.gender || "",
        credits: user.credits || 0,
        isVerified: user.isVerified || false,
        isSuspended: user.isSuspended || false,
        birthdate: user.birthdate || "",
        // Note: Role is typically handled separately or requires a specific selector, 
        // passing it might be complex if we don't have the full list of roles here.
        // For now, we'll focus on profile fields as requested.
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = () => {
    handleUpdate(user.id, formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                margin="normal"
              >
                {GENDERS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birthdate"
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credits"
                name="credits"
                type="number"
                value={formData.credits}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Status</Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <FormControlLabel
                            control={
                            <Switch
                                checked={formData.isVerified}
                                onChange={handleChange}
                                name="isVerified"
                                color="primary"
                            />
                            }
                            label="Verified"
                        />
                    </Grid>
                    <Grid item>
                         <FormControlLabel
                            control={
                            <Switch
                                checked={formData.isSuspended}
                                onChange={handleChange}
                                name="isSuspended"
                                color="warning"
                            />
                            }
                            label="Suspended"
                            sx={{ color: 'warning.main' }}
                        />
                    </Grid>
                </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
