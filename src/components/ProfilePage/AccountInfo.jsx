import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import DescriptionIcon from "@mui/icons-material/Description";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import { Alert, Avatar, Badge, Box, Button, Divider, Grid, IconButton, Paper, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../redux/auth/auth.action";
import { UploadToServer } from "../../utils/uploadToServer";

const AccountInfo = ({ user }) => {
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    setFullname(user?.fullname || "");
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setBio(user?.bio || "");
    setAvatarUrl(user?.avatarUrl || "");
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const isEmailChanging = email && user?.email && email !== user.email;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      let uploadedAvatarUrl = avatarUrl;

      if (selectedFile) {
        const username = auth?.user?.username || user?.username || "unknown";
        const uploadResult = await UploadToServer(selectedFile, username, "avatars");
        uploadedAvatarUrl = uploadResult.url;
      }

      const updatedData = {
        fullname,
        username,
        email,
        ...(password && { password }),
        bio,
        avatarUrl: uploadedAvatarUrl,
      };

      const result = await dispatch(updateUserProfile(updatedData));
      if (result?.error) {
        setError(result.error || "Failed to update account information.");
        return;
      }

      const responseMessage = result?.payload?.message || result?.message;
      const isPendingEmailVerification = 
        responseMessage?.toLowerCase().includes("check your new email") ||
        responseMessage?.toLowerCase().includes("verification otp");

      if (isEmailChanging && isPendingEmailVerification) {
        // Email change requires OTP verification - keep user logged in for secure JWT-based verification
        setMessage("Email change initiated. Please verify with the OTP sent to your new email. A recovery link will be sent to your old email after verification.");
        
        setTimeout(() => {
          navigate("/verify-email-change", {
            state: {
              email: email, // For display purposes
            },
          });
        }, 2000);
        return;
      }

      setMessage(responseMessage || "Account information updated successfully.");
      setPassword("");
      setSelectedFile(null);
      setPreviewURL("");
      setAvatarUrl(uploadedAvatarUrl);
    } catch (err) {
      setError(err?.message || "Failed to update account information.");
    } finally {
      setLoading(false);
    }
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
          Account Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your account details and credentials
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
            {/* Avatar Upload */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <IconButton
                    component="label"
                    sx={{
                      background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                      color: "white",
                      "&:hover": {
                        background: "linear-gradient(135deg, #b968c7, #9d50bb)",
                        transform: "scale(1.05)",
                      },
                      width: 36,
                      height: 36,
                      boxShadow: "0 4px 12px rgba(157, 80, 187, 0.4)",
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
                    border: "3px solid",
                    borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.4)" : "rgba(157, 80, 187, 0.3)",
                    boxShadow: "0 8px 24px rgba(157, 80, 187, 0.3)",
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
                    borderRadius: "12px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(8px)",
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
                    borderRadius: "12px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(8px)",
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
                    borderRadius: "12px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(8px)",
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
                    borderRadius: "12px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(8px)",
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
                    borderRadius: "12px",
                    background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(8px)",
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
