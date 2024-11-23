import React, { useState } from "react";
import { Box, TextField, Button, Grid, MenuItem, Typography, Alert, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/auth/auth.action";

const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const PersonalInfo = ({ user, setUser }) => {
  const [birthdate, setBirthdate] = useState(user.birthdate || "");
  const [gender, setGender] = useState(user.gender || "");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const updatedData = {
        birthdate: birthdate || null,
        gender,
      };
      const updatedUser = await dispatch(updateUserProfile(updatedData));
      setUser(updatedUser.payload);
      setMessage("Personal information updated successfully.");
    } catch (err) {
      setError("Failed to update personal information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Box component="form" onSubmit={handleUpdate}>
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                variant="outlined"
                fullWidth
                required
              >
                {genders.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {loading ? "Updating..." : "Update Personal Info"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
