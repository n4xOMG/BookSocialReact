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
    useScrollTrigger,
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
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                            backdropFilter: "blur(8px)",
                            zIndex: theme.zIndex.drawer + 1, // Đảm bảo header nằm trên drawer
                            borderRadius: 0,
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
                            {/* Mobile Menu Icon (for mobile sidebar) */}
                            {isMobile && (
                                <IconButton edge="start" sx={{ mr: 1, ml: 1 }} onClick={onSidebarToggle}>
                                    <MenuIcon />
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
                                        T
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
                                        TailVerse
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
                                        <IconButton onClick={() => setShowSearchBar(true)}>
                                            <Search />
                                        </IconButton>
                                    )}
                                    <IconButton onClick={handleOpenMore}>
                                        <MoreHoriz />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={openMore}
                                        onClose={handleCloseMore}
                                        MenuListProps={{
                                            sx: { 
                                                display: 'flex', 
                                                flexDirection: 'row',
                                                p:0,
                                                
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={() => navigate("/upload-book")}><Upload /></MenuItem>
                                        {user && <MenuItem><MessageMenu /></MenuItem>}
                                        {user && <MenuItem><NotificationMenu /></MenuItem>}
                                    </Menu>
                                    </>
                                ) : (
                                    <>
                                    <Tooltip title="Upload Book">
                                        <IconButton onClick={checkAuth(() => navigate("/upload-book"))}>
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