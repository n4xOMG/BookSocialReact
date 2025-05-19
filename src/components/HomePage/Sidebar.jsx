import { Book, Bookmark, Chat, Explore, Money, Person, Menu, Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getReadingProgressByUser } from "../../redux/user/user.action";
import ReadingHistoryCard from "./ReadingHistoryCard";

export const Sidebar = () => {
  const { readingProgresses = [] } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(!isMobile);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Access authentication state from Redux store
  const { user } = useSelector((state) => state.auth);

  const menuItems = useMemo(
    () => [
      { text: "Home", icon: <Explore />, link: "/" },
      ...(user
        ? [
            { text: "My Stories", icon: <Book />, link: "/stories" },
            { text: "Library", icon: <Bookmark />, link: "/library" },
            { text: "Credit Packages", icon: <Money />, link: "/credit-packages" },
          ]
        : []),
      { text: "Book Clubs", icon: <Chat />, link: "/book-clubs" },
    ],
    [user]
  );

  useEffect(() => {
    // Only fetch reading progress when the user is logged in and the history is expanded
    if (user && historyExpanded && readingProgresses.length === 0 && !isLoadingHistory) {
      setIsLoadingHistory(true);
      try {
        dispatch(getReadingProgressByUser()).finally(() => setIsLoadingHistory(false));
      } catch (error) {
        console.error("Error trying to get reading progress: ", error);
        setIsLoadingHistory(false);
      }
    }
  }, [dispatch, user, historyExpanded, readingProgresses.length, isLoadingHistory]);

  const toggleDrawer = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const handleHistoryToggle = useCallback(() => {
    setHistoryExpanded(!historyExpanded);
  }, [historyExpanded]);

  const handleNavigation = useCallback(
    (link) => {
      navigate(link);
      if (isMobile) {
        setMobileOpen(false);
      }
    },
    [navigate, isMobile]
  );

  const drawerContent = (
    <>
      {/* Sidebar Header */}
      <Box
        sx={{
          cursor: "pointer",
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleNavigation("/")}
        >
          <Avatar
            src={user?.avatarUrl || "https://via.placeholder.com/32?text=B"}
            alt="BookSocial"
            sx={{
              width: 32,
              height: 32,
              mr: 1.5,
              background: theme.palette.primary.main,
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

        {isMobile && (
          <IconButton edge="end" onClick={toggleDrawer} sx={{ color: theme.palette.primary.main }}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.link;
          return (
            <Tooltip title={item.text} placement="right" key={item.text} arrow disableHoverListener={isMobile}>
              <ListItemButton
                onClick={() => handleNavigation(item.link)}
                selected={isActive}
                sx={{
                  my: 0.5,
                  mx: 1,
                  borderRadius: 1.5,
                  py: isMobile ? 1.5 : 1,
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main + "15",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main + "25",
                    },
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                    },
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: isMobile ? "1rem" : "0.95rem",
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Reading History Section - only show if user is logged in */}
      {user && (
        <Box sx={{ px: 2, mt: 2 }}>
          <ListItemButton
            onClick={handleHistoryToggle}
            sx={{
              borderRadius: 1.5,
              mb: 1,
              py: isMobile ? 1.5 : 1,
            }}
          >
            <ListItemText
              primary="Reading History"
              primaryTypographyProps={{
                fontSize: isMobile ? "1rem" : "0.9rem",
                fontWeight: "bold",
              }}
            />
            {historyExpanded ? (
              <Typography variant="caption" color="text.secondary">
                Hide
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Show
              </Typography>
            )}
          </ListItemButton>

          <Collapse in={historyExpanded} timeout="auto" unmountOnExit>
            <ReadingHistoryCard readingProgresses={readingProgresses} loading={isLoadingHistory} />
          </Collapse>
        </Box>
      )}

      {/* User Section - show at bottom if logged in */}
      {user && (
        <Box
          sx={{
            mt: "auto",
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            position: "sticky",
            bottom: 0,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <ListItemButton
            onClick={() => handleNavigation("/profile")}
            sx={{
              borderRadius: 1.5,
              "&:hover": { backgroundColor: theme.palette.action.hover },
              py: isMobile ? 1.5 : 1,
            }}
          >
            <Avatar src={user.avatarUrl} alt={user.name} sx={{ width: 32, height: 32, mr: 1.5 }} />
            <Box>
              <Typography variant="body2" fontWeight="medium" noWrap>
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                  maxWidth: 120,
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </ListItemButton>
        </Box>
      )}
    </>
  );

  // Mobile drawer toggle button (shown only on mobile)
  const drawerToggle = isMobile && (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        top: "auto",
        bottom: 0,
        display: { xs: "block", md: "none" },
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 56 }}>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleDrawer} sx={{ color: theme.palette.primary.main }}>
          <Menu />
        </IconButton>

        <Typography variant="body1" fontWeight="medium">
          Menu
        </Typography>

        {user && (
          <IconButton edge="end" onClick={() => handleNavigation("/profile")} sx={{ color: theme.palette.primary.main }}>
            <Person />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );

  return (
    <>
      {/* Permanent drawer for desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              borderRight: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.paper,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Temporary drawer for mobile */}
      {isMobile && (
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onOpen={toggleDrawer}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: "85%",
              maxWidth: 320,
              boxSizing: "border-box",
              background: theme.palette.background.paper,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            },
          }}
        >
          {drawerContent}
        </SwipeableDrawer>
      )}

      {/* Mobile drawer toggle */}
      {drawerToggle}
    </>
  );
};

export default Sidebar;
