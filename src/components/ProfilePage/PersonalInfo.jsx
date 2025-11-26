import CakeIcon from "@mui/icons-material/Cake";
import SaveIcon from "@mui/icons-material/Save";
import WcIcon from "@mui/icons-material/Wc";
import { Alert, Box, Button, Divider, Grid, MenuItem, Paper, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/auth/auth.action";

const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const PersonalInfo = ({ user }) => {
  const [birthdate, setBirthdate] = useState(user?.birthdate ? user.birthdate.slice(0, 10) : "");
  const [gender, setGender] = useState(user?.gender || "");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setBirthdate(user?.birthdate ? user.birthdate.slice(0, 10) : "");
    setGender(user?.gender || "");
  }, [user]);

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
      const result = await dispatch(updateUserProfile(updatedData));
      if (result?.error) {
        setError(result.error || "Failed to update personal information.");
        return;
      }

      setMessage(result?.message || "Personal information updated successfully.");
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

  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          fontWeight="medium"
          sx={{
            fontFamily: '"Playfair Display", serif',
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Personal Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update your personal details and preferences
        </Typography>

        <Divider sx={{ mb: 4, opacity: 0.3 }} />

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
                    borderRadius: "12px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(8px)",
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
                    borderRadius: "12px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(8px)",
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
                  borderRadius: "12px",
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                  boxShadow: "0 4px 16px rgba(157, 80, 187, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #b968c7, #9d50bb)",
                    boxShadow: "0 6px 24px rgba(157, 80, 187, 0.5)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    background: "rgba(157, 80, 187, 0.3)",
                  },
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
