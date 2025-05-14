import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import DescriptionIcon from "@mui/icons-material/Description";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import { Alert, Avatar, Badge, Box, Button, Divider, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/auth/auth.action";
import UploadToCloudinary from "../../utils/uploadToCloudinary";

const AccountInfo = ({ user, setUser }) => {
  const [fullname, setFullname] = useState(user.fullname || "");
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      let uploadedAvatarUrl = avatarUrl;

      if (selectedFile) {
        // Upload the selected file to Cloudinary
        uploadedAvatarUrl = await UploadToCloudinary(selectedFile, "avatars");
      }

      const updatedData = {
        fullname,
        username,
        email,
        ...(password && { password }),
        bio,
        avatarUrl: uploadedAvatarUrl,
      };

      const updatedUser = await dispatch(updateUserProfile(updatedData));
      setUser(updatedUser.payload);
      setMessage("Account information updated successfully.");
      setPassword("");
      setSelectedFile(null);
      setPreviewURL("");
    } catch (err) {
      setError("Failed to update account information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.background.paper }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Account Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your account details and credentials
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
            {/* Avatar Upload */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <IconButton
                    component="label"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      width: 36,
                      height: 36,
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                  </IconButton>
                }
              >
                <Avatar
                  src={previewURL || avatarUrl}
                  alt={fullname}
                  sx={{
                    width: 120,
                    height: 120,
                    boxShadow: 2,
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Badge>
            </Grid>

            {selectedFile && (
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: -2, mb: 2 }}>
                <Typography variant="body2" color="primary">
                  {selectedFile.name}
                </Typography>
              </Grid>
            )}

            {/* Full Name */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <PersonIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Full Name
                </Typography>
              </Box>
              <TextField
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                variant="outlined"
                fullWidth
                required
                placeholder="Enter your full name"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Username */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <AlternateEmailIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Username
                </Typography>
              </Box>
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                fullWidth
                required
                placeholder="Choose a unique username"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <AlternateEmailIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Email Address
                </Typography>
              </Box>
              <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                required
                placeholder="Enter your email address"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* New Password */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <LockIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Password
                </Typography>
              </Box>
              <TextField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder="Enter a new password"
                helperText="Leave blank to keep your current password"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Bio */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="flex-start" mb={1}>
                <DescriptionIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Bio
                </Typography>
              </Box>
              <TextField
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                placeholder="Tell us about yourself"
                helperText="Share a little about yourself with the community"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Submit Button */}
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
                {loading ? "Updating..." : "Save Account Changes"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default AccountInfo;
