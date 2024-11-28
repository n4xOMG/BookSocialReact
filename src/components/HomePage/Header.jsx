import { Upload } from "@mui/icons-material";
import { AppBar, Box, IconButton, Stack, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
import LoadingSpinner from "../LoadingSpinner";
import MessageMenu from "./Header/MessageMenu";
import NotificationMenu from "./Header/NotificationMenu";
import ProfileMenu from "./Header/ProfileMenu";
import SearchBar from "./SearchBar";
import { searchBookAction } from "../../redux/book/book.action";
const Header = () => {
  const navigate = useNavigate();
  const { checkAuth, AuthDialog } = useAuthCheck();

  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(getCategories());
      dispatch(getTags());
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  const handleSearch = () => {
    const tagIds = selectedTags.map((tag) => tag.id);
    dispatch(searchBookAction(title.trim(), categoryId || null, tagIds));
  };
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <AppBar position="sticky" color="default">
          <Toolbar>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              <SearchBar
                categories={categories}
                tags={tags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                selectedCategory={categoryId}
                setSelectedCategory={setCategoryId}
                searchTitle={title}
                setSearchTitle={setTitle}
                onSearch={handleSearch}
              />
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={checkAuth(() => navigate("/upload-book"))}>
                <Upload />
              </IconButton>
              {user && (
                <>
                  <MessageMenu />
                  <NotificationMenu />
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
