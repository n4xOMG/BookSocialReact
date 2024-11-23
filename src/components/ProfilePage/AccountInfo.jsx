import React, { useState } from "react";
import { Box, TextField, Button, Grid, Typography, Alert, Card, CardContent, Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/auth/auth.action";
import UploadToCloudinary from "../../utils/uploadToCloudinary"; // Adjust the import path as needed

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
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Account Information
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
            {/* Full Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>

            {/* Username */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>

            {/* New Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
                helperText="Leave blank to keep current password."
              />
            </Grid>

            {/* Avatar Preview */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={previewURL || avatarUrl} alt="Avatar" sx={{ width: 80, height: 80 }} />
                <Button variant="contained" component="label">
                  {selectedFile ? "Change Avatar" : "Upload Avatar"}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
              </Box>
              {selectedFile && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {selectedFile.name}
                </Typography>
              )}
            </Grid>

            {/* Bio */}
            <Grid item xs={12}>
              <TextField
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                helperText="Tell us something about yourself."
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {loading ? "Updating..." : "Update Account"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountInfo;
