import { Menu, Search, Upload } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
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
import SearchDropdown from "./SearchDropdown";

// Hide AppBar on scroll down, show on scroll up
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const navigate = useNavigate();
  const { checkAuth, AuthDialog } = useAuthCheck();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([dispatch(getCategories()), dispatch(getTags())]);
      } catch (e) {
        console.error("Error loading categories or tags:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleQuickSearch = useCallback(
    (e) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        const params = new URLSearchParams();
        params.append("title", searchQuery.trim());
        navigate(`/search-results?${params}`);
        setSearchQuery("");
        setShowSearchBar(false);
        setShowDropdown(false);
      }
    },
    [searchQuery, navigate]
  );

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setShowDropdown(true);
    }
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.trim().length >= 2);
  };

  // Toggle search bar on mobile
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <HideOnScroll>
          <AppBar
            position="sticky"
            color="default"
            elevation={0}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              backdropFilter: "blur(8px)",
              zIndex: theme.zIndex.drawer - 1,
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                minHeight: { xs: 56, sm: 64 },
                px: { xs: 1, sm: 2 },
              }}
            >
              {/* Mobile Menu Icon (if needed for mobile sidebar) */}
              {isMobile && (
                <IconButton edge="start" sx={{ mr: 1 }}>
                  <Menu />
                </IconButton>
              )}

              {/* Logo - only visible when search bar is hidden on mobile */}
              {(!showSearchBar || !isMobile) && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    mr: 2,
                  }}
                  onClick={() => navigate("/")}
                >
                  <Avatar
                    src="/logo.png"
                    alt="BookSocial"
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      background: theme.palette.primary.main,
                      display: { xs: "none", sm: "flex" },
                    }}
                  >
                    B
                  </Avatar>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    BookSocial
                  </Typography>
                </Box>
              )}

              {/* Desktop Search Input */}
              {!isMobile && (
                <Box sx={{ flex: 1, maxWidth: 440, mx: 2, position: "relative" }}>
                  <TextField
                    placeholder="Quick search for books..."
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleQuickSearch}
                    onFocus={handleSearchFocus}
                    ref={searchInputRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            sx={{
                              minWidth: "auto",
                              fontSize: "0.75rem",
                              textTransform: "none",
                              py: 0,
                            }}
                            onClick={() => {
                              setSearchQuery("");
                              setShowDropdown(false);
                            }}
                          >
                            Clear
                          </Button>
                          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                          <Button
                            size="small"
                            color="primary"
                            sx={{
                              minWidth: "auto",
                              fontSize: "0.75rem",
                              textTransform: "none",
                              py: 0,
                            }}
                            onClick={() => navigate("/advanced-search")}
                          >
                            Advanced
                          </Button>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        backgroundColor: theme.palette.action.hover,
                        "&:hover": {
                          backgroundColor: theme.palette.background.paper,
                        },
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                  <SearchDropdown anchorEl={searchInputRef.current} searchQuery={searchQuery} onClose={closeDropdown} />
                </Box>
              )}

              {/* Mobile Search Bar (when active) */}
              {isMobile && showSearchBar && (
                <Box sx={{ flex: 1 }}>
                  <TextField
                    placeholder="Search books..."
                    size="small"
                    fullWidth
                    autoFocus
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleQuickSearch}
                    onFocus={handleSearchFocus}
                    ref={searchInputRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={toggleSearchBar} size="small">
                            {theme.direction === "ltr" ? "X" : "X"}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        backgroundColor: theme.palette.action.hover,
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                  <SearchDropdown anchorEl={searchInputRef.current} searchQuery={searchQuery} onClose={closeDropdown} />
                </Box>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }} alignItems="center">
                {/* Mobile Search Toggle */}
                {isMobile && !showSearchBar && (
                  <IconButton onClick={toggleSearchBar} size="small">
                    <Search />
                  </IconButton>
                )}

                {/* Upload Button */}
                <Tooltip title="Upload Book">
                  <IconButton
                    onClick={checkAuth(() => navigate("/upload-book"))}
                    sx={{
                      color: "primary.main",
                      display: { xs: "none", sm: "flex" },
                    }}
                  >
                    <Upload />
                  </IconButton>
                </Tooltip>

                {/* Only show desktop upload button for mobile */}
                {isMobile && !showSearchBar && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Upload />}
                    onClick={checkAuth(() => navigate("/upload-book"))}
                    disableElevation
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "0.8rem",
                    }}
                  >
                    Upload
                  </Button>
                )}

                {/* Message & Notification Menu - Only show if user is logged in */}
                {(!showSearchBar || !isMobile) && user && (
                  <>
                    <MessageMenu />
                    <NotificationMenu />
                  </>
                )}

                {/* Profile Menu */}
                {(!showSearchBar || !isMobile) && <ProfileMenu />}
              </Stack>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
      )}
      <AuthDialog />
    </>
  );
};

export default Header;
