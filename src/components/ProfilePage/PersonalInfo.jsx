import { Alert, Box, Button, Card, CardContent, Grid, MenuItem, TextField, Typography, Divider } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/auth/auth.action";
const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const PersonalInfo = ({ user, setUser }) => {
  const initialBirthdate = user.birthdate ? user.birthdate.split("T")[0] : "";
  const [birthdate, setBirthdate] = useState(initialBirthdate);
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
      const formattedBirthdate = birthdate ? new Date(birthdate).toISOString().slice(0, 19) : null;
      const updatedData = {
        birthdate: formattedBirthdate,
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
        <Divider sx={{ mb: 2 }} />
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
