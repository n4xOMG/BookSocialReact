import { Inbox, Message, Notifications, Search, Upload } from "@mui/icons-material";
import { AppBar, Avatar, Badge, Box, IconButton, InputBase, Stack, Toolbar } from "@mui/material";
import SearchBar from "./SearchBar";

export const Header = () => (
  <AppBar position="sticky" color="default">
    <Toolbar>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <SearchBar />
      </Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton>
          <Upload />
        </IconButton>
        <IconButton>
          <Badge badgeContent={4} color="primary">
            <Inbox />
          </Badge>
        </IconButton>
        <IconButton>
          <Badge badgeContent={4} color="primary">
            <Notifications />
          </Badge>
        </IconButton>
        <Avatar src="https://github.com/shadcn.png" alt="@shadcn" />
      </Stack>
    </Toolbar>
  </AppBar>
);
