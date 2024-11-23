import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserChats } from "../../redux/chat/chat.action";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Badge, CircularProgress, Typography } from "@mui/material";

const ChatList = ({ selectedChat, setSelectedChat }) => {
  const dispatch = useDispatch();
  const { chats, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchUserChats());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <List>
      {chats.map((chat) => (
        <ListItem button key={chat.userId} selected={selectedChat === chat.userId} onClick={() => setSelectedChat(chat.userId)}>
          <ListItemAvatar>
            <Avatar src={chat.avatarUrl} />
          </ListItemAvatar>
          <ListItemText primary={chat.fullname} secondary={chat.lastMessageContent} />
          {chat.unreadCount > 0 && <Badge badgeContent={chat.unreadCount} color="error" />}
        </ListItem>
      ))}
    </List>
  );
};

export default ChatList;
