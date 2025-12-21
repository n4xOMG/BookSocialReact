import { Menu as MenuIcon, Search, Upload, MoreHoriz } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../redux/category/category.action";
import { getTags } from "../../redux/tag/tag.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
import LoadingSpinner from "../LoadingSpinner";
import MessageMenu from "./Header/MessageMenu";
import NotificationMenu from "./Header/NotificationMenu";
import ProfileMenu from "./Header/ProfileMenu";
import SearchDropdown from "./SearchDropdown";

function HideOnScroll({ children }) {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll) {
        if (currentScroll > 80) {
          setShow(false);
        }
      } else if (currentScroll < lastScroll) {
        setShow(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <Slide appear={false} direction="down" in={show}>
      {children}
    </Slide>
  );
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Header = ({ onSidebarToggle }) => {
  const navigate = useNavigate();
  const { checkAuth, AuthDialog } = useAuthCheck();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const searchInputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const isInitialMount = useRef(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);
  const handleOpenMore = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMore = () => setAnchorEl(null);

  useEffect(() => {
    const fetchData = async () => {
      if (categories.length === 0 || tags.length === 0) {
        setLoading(true);
        try {
          await Promise.all([
            categories.length === 0 ? dispatch(getCategories()) : Promise.resolve(),
            tags.length === 0 ? dispatch(getTags()) : Promise.resolve(),
          ]);
        } catch (e) {
          console.error("Error loading categories or tags:", e);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isInitialMount.current) {
      fetchData();
      isInitialMount.current = false;
    }
  }, [dispatch, categories.length, tags.length]);

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

  useEffect(() => {
    if (debouncedSearchQuery.trim().length >= 2) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedSearchQuery]);

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
  };

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
              borderBottom: `1px solid`,
              borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
              backgroundColor: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.75)" : "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              zIndex: theme.zIndex.drawer + 1,
              borderRadius: 0,
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
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
              {/* Mobile Menu Icon */}
              {isMobile && (
                <IconButton edge="start" sx={{ mr: 1, ml: 1 }} onClick={onSidebarToggle}>
                  <MenuIcon />
                </IconButton>
              )}

              {/* Logo */}
              {(!showSearchBar || !isMobile) && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    mr: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => navigate("/")}
                >
                  <Avatar
                    src="/logo512.png"
                    alt="BookSocial"
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 1.5,
                      display: { xs: "none", sm: "flex" },
                      border: "2px solid",
                      borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(157, 80, 187, 0.2)",
                      boxShadow: "0 4px 12px rgba(157, 80, 187, 0.3)",
                    }}
                  >
                    T
                  </Avatar>
                  <Typography
                    variant="h6"
                    className="font-serif"
                    fontWeight="800"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontSize: { xs: "1.1rem", sm: "1.3rem" },
                      letterSpacing: "-0.01em",
                    }}
                  >
                    TailVerse
                  </Typography>
                </Box>
              )}

              {/* Desktop Search Input */}
              {!isMobile && (
                <Box sx={{ flex: 1, maxWidth: 480, mx: 2, position: "relative" }}>
                  <TextField
                    placeholder="Search for stories, novels, poetry..."
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
                          <Search fontSize="small" sx={{ color: "text.secondary" }} />
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
                              px: 1,
                              borderRadius: "8px",
                              fontWeight: 600,
                            }}
                            onClick={() => {
                              setSearchQuery("");
                              setShowDropdown(false);
                            }}
                          >
                            Clear
                          </Button>
                          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, opacity: 0.3 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "12px",
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid",
                        borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                          borderColor: theme.palette.primary.main,
                        },
                        "&.Mui-focused": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 3px ${theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.15)" : "rgba(157, 80, 187, 0.1)"}`,
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

              {/* Mobile Search Bar */}
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
                            X
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
              <Stack direction="row" spacing={1} alignItems="center">
                {isMobile ? (
                  <>
                    {!showSearchBar && (
                      <IconButton
                        onClick={() => setShowSearchBar(true)}
                        sx={{
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid",
                          borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                          "&:hover": {
                            backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                          },
                        }}
                      >
                        <Search />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={handleOpenMore}
                      sx={{
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid",
                        borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                        "&:hover": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                        },
                      }}
                    >
                      <MoreHoriz />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMore}
                      onClose={handleCloseMore}
                      MenuListProps={{
                        sx: {
                          display: "flex",
                          flexDirection: "row",
                          p: 0,
                        },
                      }}
                    >
                      <MenuItem onClick={() => navigate("/upload-book")}>
                        <Upload />
                      </MenuItem>
                      {user && (
                        <MenuItem>
                          <MessageMenu />
                        </MenuItem>
                      )}
                      {user && (
                        <MenuItem>
                          <NotificationMenu />
                        </MenuItem>
                      )}
                    </Menu>
                  </>
                ) : (
                  <>
                    <Tooltip title="Upload Story" arrow>
                      <IconButton
                        onClick={checkAuth(() => navigate("/upload-book"))}
                        sx={{
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid",
                          borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "primary.main",
                            borderColor: "primary.main",
                            color: "#fff",
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Upload />
                      </IconButton>
                    </Tooltip>
                    {user && <MessageMenu />}
                    {user && <NotificationMenu />}
                  </>
                )}
                <ProfileMenu />
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
