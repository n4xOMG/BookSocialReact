import { Avatar, Box, Card, CardHeader, TextField, Autocomplete } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../redux/user/user.action";
import { createChat } from "../../redux/chat/chat.action";

export default function SearchUser() {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const { searchUsers } = useSelector((state) => state.user);

  const handleSearchUser = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value) {
      dispatch(searchUser(value));
    }
  };

  const handleClick = (id) => {
    dispatch(createChat(id));
    setUsername("");
  };

  return (
    <Box>
      <Autocomplete
        freeSolo
        options={searchUsers}
        getOptionLabel={(option) => option.username}
        inputValue={username}
        onInputChange={(event, newInputValue) => {
          setUsername(newInputValue);
          if (newInputValue) {
            dispatch(searchUser(newInputValue));
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            type="text"
            placeholder="Search User"
            sx={{
              backgroundColor: "transparent",
              outline: "none",
              width: "100%",
              py: 3,
              px: 5,
              borderRadius: 10,
              border: 1,
              borderColor: "#3b40544",
            }}
          />
        )}
        renderOption={(props, option) => (
          <Card {...props} key={option.id} sx={{ width: "100%", cursor: "pointer" }} onClick={() => handleClick(option.id)}>
            <CardHeader
              avatar={<Avatar src="https://www.w3schools.com/howto/img_avatar.png" />}
              title={option.username}
              subheader={option.fullname}
            />
          </Card>
        )}
      />
    </Box>
  );
}
