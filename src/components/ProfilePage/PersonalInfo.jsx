import { Alert, Box, Button, Grid, MenuItem, TextField, Typography, Divider, Paper } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/auth/auth.action";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import SaveIcon from "@mui/icons-material/Save";

const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const PersonalInfo = ({ user, setUser }) => {
  const initialBirthdate = user.birthdate ? user.birthdate.slice(0, 10) : "";
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

  // Custom styles for date picker wrapper
  const datePickerWrapperStyles = {
    width: "100%",
    "& .react-datepicker-wrapper": {
      width: "100%",
    },
    "& .react-datepicker__input-container": {
      width: "100%",
    },
    "& .date-picker-input": {
      width: "100%",
      padding: "14px 12px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid rgba(0, 0, 0, 0.23)",
      transition: "border-color 0.2s",
      fontFamily: "inherit",
      "&:focus": {
        borderColor: "#1976d2",
        outline: "none",
      },
      "&:hover": {
        borderColor: "rgba(0, 0, 0, 0.87)",
      },
    },
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.background.paper }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Personal Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update your personal details and preferences
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Box component="form" onSubmit={handleUpdate}>
          {message && (
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: 2, "& .MuiAlert-icon": { alignItems: "center" } }}
              onClose={() => setMessage(null)}
            >
              {message}
            </Alert>
          )}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2, "& .MuiAlert-icon": { alignItems: "center" } }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <CakeIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Date of Birth
                </Typography>
              </Box>
              <TextField
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                This helps us personalize your experience
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <WcIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Gender
                </Typography>
              </Box>
              <TextField
                select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                variant="outlined"
                fullWidth
                required
                placeholder="Select your gender"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                {genders.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={<SaveIcon />}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  boxShadow: 2,
                }}
              >
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default PersonalInfo;
