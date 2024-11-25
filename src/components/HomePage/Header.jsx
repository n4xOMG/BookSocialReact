import { Upload } from "@mui/icons-material";
import { AppBar, Box, IconButton, Stack, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageMenu from "./Header/MessageMenu";
import NotificationMenu from "./Header/NotificationMenu";
import ProfileMenu from "./Header/ProfileMenu";
import SearchBar from "./SearchBar";
import { useAuthCheck } from "../../utils/useAuthCheck";
import { getNotifications } from "../../redux/notification/notification.action";
import LoadingSpinner from "../LoadingSpinner";
import { fetchUserChats } from "../../redux/chat/chat.action";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";

const Header = () => {
  const navigate = useNavigate();
  const { checkAuth, AuthDialog } = useAuthCheck();
  const { notifications } = useSelector((state) => state.notification);
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getCategories());
      dispatch(getTags());
      dispatch(fetchUserChats());
      dispatch(getNotifications());
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <AppBar position="sticky" color="default">
          <Toolbar>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              <SearchBar categories={categories} tags={tags} />
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={checkAuth(() => navigate("/upload-book"))}>
                <Upload />
              </IconButton>
              {user && (
                <>
                  <MessageMenu chats={chats} />
                  <NotificationMenu notifications={notifications} />
                </>
              )}

              <ProfileMenu />
            </Stack>
          </Toolbar>
        </AppBar>
      )}
      <AuthDialog />
    </>
  );
};

export default Header;
