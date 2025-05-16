import { Avatar, Box, Card, CardHeader, TextField, Autocomplete, CircularProgress, Typography, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../redux/user/user.action";
import { createChat } from "../../redux/chat/chat.action";

export default function SearchUser() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { searchUsers } = useSelector((state) => state.user);

  const handleSearchUser = (value) => {
    setUsername(value);

    if (value?.trim()) {
      setLoading(true);
      dispatch(searchUser(value)).finally(() => setLoading(false));
    }
  };

  const handleClick = (id) => {
    setLoading(true);
    dispatch(createChat(id)).finally(() => {
      setUsername("");
      setOpen(false);
      setLoading(false);
    });
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Autocomplete
        freeSolo
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={searchUsers || []}
        getOptionLabel={(option) => (typeof option === "string" ? option : option.username)}
        inputValue={username}
        onInputChange={(event, newInputValue) => {
          handleSearchUser(newInputValue);
        }}
        loading={loading}
        noOptionsText="No users found"
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search users"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: <SearchIcon color="action" sx={{ ml: 1, mr: 0.5 }} />,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <Card
            {...props}
            key={option.id}
            sx={{
              width: "100%",
              cursor: "pointer",
              boxShadow: "none",
              borderRadius: 0,
              "&:hover": {
                bgcolor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
              },
            }}
            onClick={() => handleClick(option.id)}
          >
            <CardHeader
              avatar={<Avatar src={option.avatarUrl || "https://www.w3schools.com/howto/img_avatar.png"} sx={{ width: 36, height: 36 }} />}
              title={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {option.username}
                </Typography>
              }
              subheader={
                <Typography variant="caption" color="text.secondary">
                  {option.fullname}
                </Typography>
              }
              sx={{ py: 1, px: 2 }}
            />
          </Card>
        )}
      />
    </Box>
  );
}
