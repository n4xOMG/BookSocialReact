import { Book, Bookmark, Brightness4, Brightness7, Chat, ChevronLeft, ChevronRight, Dashboard, Explore, Money } from "@mui/icons-material";
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
  SwipeableDrawer,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getReadingProgressByUser } from "../../redux/user/user.action";
import ReadingHistoryCard from "./ReadingHistoryCard";

// Định nghĩa DrawerHeader và MiniDrawer
const drawerWidth = 220;
const collapsedDrawerWidth = 70;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  backgroundColor: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.75)" : "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  borderRight: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
  boxShadow: "4px 0 24px rgba(0, 0, 0, 0.08)",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: collapsedDrawerWidth,
  [theme.breakpoints.up("sm")]: {
    width: collapsedDrawerWidth,
  },
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  backgroundColor: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.75)" : "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  borderRight: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
  boxShadow: "4px 0 24px rgba(0, 0, 0, 0.08)",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const MiniDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const Sidebar = ({ toggleTheme, isDarkMode, open, setOpen }) => {
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const { readingProgresses, loading: userLoading } = useSelector(
    (state) => ({
      readingProgresses: state.user.readingProgresses,
      loading: state.user.loading,
    }),
    shallowEqual
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [historyExpanded, setHistoryExpanded] = useState(true);

  // Thay đổi 3: Memoize menu items
  const menuItems = useMemo(
    () => [
      { text: "Home", icon: <Explore />, link: "/" },
      ...(user
        ? [
            { text: "My Stories", icon: <Book />, link: "/stories" },
            { text: "Library", icon: <Bookmark />, link: "/library" },
            { text: "Credit Packages", icon: <Money />, link: "/credit-packages" },
            { text: "Author Dashboard", icon: <Dashboard />, link: "/author/dashboard" },
          ]
        : []),
      { text: "Book Clubs", icon: <Chat />, link: "/book-clubs" },
    ],
    [user]
  );

  useEffect(() => {
    if (user && readingProgresses.length === 0) {
      dispatch(getReadingProgressByUser());
    }
  }, [dispatch, user, readingProgresses.length]);

  const handleHistoryToggle = useCallback(() => {
    setHistoryExpanded((prev) => !prev);
  }, []);

  const handleNavigation = useCallback(
    (link) => {
      navigate(link);
      if (isMobile) {
        setOpen(false);
      }
    },
    [navigate, isMobile]
  );

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: `${theme.palette.primary.main} transparent`,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: theme.palette.primary.main,
          borderRadius: "10px",
        },
      }}
    >
      {/* Sidebar Header */}
      <DrawerHeader sx={{ justifyContent: "left", px: 2 }}>
        {/* Thay đổi 4: Tối ưu hóa logic hiển thị nút */}
        <IconButton onClick={() => setOpen(!open)} sx={{ display: "inline-flex" }}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.link;
          return (
            <Tooltip title={open ? "" : item.text} placement="right" key={item.text} arrow>
              <ListItemButton
                onClick={() => handleNavigation(item.link)}
                selected={isActive}
                sx={{
                  my: 0.5,
                  mx: 1,
                  borderRadius: "12px",
                  py: 1.2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&.Mui-selected": {
                    background: "linear-gradient(135deg, rgba(157, 80, 187, 0.15), rgba(0, 201, 167, 0.1))",
                    backdropFilter: "blur(10px)",
                    border: "1px solid",
                    borderColor: "rgba(157, 80, 187, 0.3)",
                    boxShadow: "0 4px 12px rgba(157, 80, 187, 0.2)",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(157, 80, 187, 0.25), rgba(0, 201, 167, 0.15))",
                      transform: "translateX(4px)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    width: 40,
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Reading History Section */}
      {user && open && (
        <Box sx={{ px: 2, mt: 2 }}>
          <ListItemButton
            onClick={handleHistoryToggle}
            sx={{
              borderRadius: 1.5,
              mb: 1,
              py: 1,
            }}
          >
            <ListItemText
              primary="Reading History"
              primaryTypographyProps={{
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {historyExpanded ? "Hide" : "Show"}
            </Typography>
          </ListItemButton>
          <Collapse in={historyExpanded} timeout="auto" unmountOnExit>
            <ReadingHistoryCard readingProgresses={readingProgresses} loading={userLoading} />
          </Collapse>
        </Box>
      )}

      <Box
        sx={{
          mt: "auto",
          p: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          bottom: 0,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Theme Toggle Button */}
        <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} placement="right" arrow>
          <ListItemButton
            onClick={toggleTheme}
            sx={{
              borderRadius: 1.5,
              mb: 1,
              py: 1,
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.text.primary,
                minWidth: 0,
                width: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </ListItemIcon>
            <ListItemText primary={isDarkMode ? "Light Mode" : "Dark Mode"} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </Tooltip>

        {/* User Section - show only if logged in */}
        {user && (
          <ListItemButton
            onClick={() => handleNavigation("/profile")}
            sx={{
              borderRadius: 1.5,
              py: 1,
              justifyContent: open ? "initial" : "center",
            }}
          >
            <Avatar src={user.avatarUrl} alt={user.name} sx={{ width: 32, height: 32, mr: open ? 1.5 : 0 }} />
            <Box sx={{ opacity: open ? 1 : 0, overflow: "hidden", whiteSpace: "nowrap" }}>
              <Typography variant="body2" fontWeight="medium" noWrap>
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </ListItemButton>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      {!isMobile && (
        <MiniDrawer variant="permanent" open={open}>
          {drawerContent}
        </MiniDrawer>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <SwipeableDrawer
          variant="temporary"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: "85%",
              maxWidth: 200,
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
    </>
  );
};

export default Sidebar;
