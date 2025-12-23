import { CreditCard } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BlockIcon from "@mui/icons-material/Block";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabPanel } from "../../components/BookDetailPageComponents/ChapterListComponent/TabPanel";
import AccountInfo from "../../components/ProfilePage/AccountInfo";
import BlockedUsersList from "../../components/ProfilePage/BlockedUsersList";
import FollowersList from "../../components/ProfilePage/FollowersList";
import FollowingList from "../../components/ProfilePage/FollowingList.jsx";
import PersonalInfo from "../../components/ProfilePage/PersonalInfo";
import PurchaseHistory from "../../components/ProfilePage/PurchaseHistory.jsx";
import ReadingHistory from "../../components/ProfilePage/ReadingHistory";
import { getCurrentUserByJwt } from "../../redux/auth/auth.action";
import UserPreferences from "./UserPreferences";

const ProfilePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const { user, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const hasRequestedRef = useRef(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (user || hasRequestedRef.current) {
      return;
    }

    const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (!jwt) {
      hasRequestedRef.current = true;
      return;
    }

    hasRequestedRef.current = true;
    dispatch(getCurrentUserByJwt(jwt));
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const isLoadingProfile = !user && authLoading;
  const profileError = !user ? authError : null;

  const handleRetry = () => {
    const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (!jwt) {
      return;
    }
    dispatch(getCurrentUserByJwt(jwt));
  };

  if (isLoadingProfile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Alert severity="error" variant="filled" sx={{ borderRadius: 2, mb: 3 }}>
            {profileError || "Failed to load user profile."}
          </Alert>
          {typeof window !== "undefined" && localStorage.getItem("jwt") && (
            <Button variant="contained" color="primary" onClick={handleRetry} sx={{ borderRadius: 2 }}>
              Retry
            </Button>
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100%",
        flexDirection: "column",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f0f1c 0%, #1a1a2e 100%)"
            : "linear-gradient(135deg, #f8f7f4 0%, #e8e6e3 100%)",
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, flex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            height: isMobile ? 150 : 200,
            borderRadius: "24px 24px 0 0",
            background: "linear-gradient(135deg, rgba(157, 80, 187, 0.3), rgba(110, 72, 170, 0.3))",
            mb: -8,
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "60%",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(to top, rgba(18, 18, 30, 0.9), rgba(18, 18, 30, 0))"
                  : "linear-gradient(to top, rgba(248, 247, 244, 0.9), rgba(248, 247, 244, 0))",
            }}
          />
        </Paper>

        <Card
          sx={{
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            overflow: "visible",
            position: "relative",
            background: theme.palette.mode === "dark" ? "rgba(18, 18, 30, 0.7)" : "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.2)" : "rgba(157, 80, 187, 0.15)",
          }}
        >
          <Avatar
            src={user.avatarUrl}
            alt={user.fullname}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid",
              borderColor: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.5)" : "rgba(157, 80, 187, 0.3)",
              position: "absolute",
              top: -40,
              left: 40,
              boxShadow: "0 8px 24px rgba(157, 80, 187, 0.4)",
            }}
          />

          <CardContent sx={{ pt: 10, pb: 2 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{
                ml: 2,
                fontFamily: '"Playfair Display", serif',
                background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {user.fullname}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                ml: 2,
                mb: isMobile ? 1 : 4,
                color: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.8)" : "rgba(110, 72, 170, 0.8)",
                fontWeight: 500,
              }}
            >
              @{user.username}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 3,
                "& .MuiTab-root": {
                  minHeight: 64,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  minWidth: 120,
                  borderRadius: "12px",
                  mx: 0.5,
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.2)" : "rgba(157, 80, 187, 0.15)",
                    backdropFilter: "blur(8px)",
                  },
                  "&:hover": {
                    background: theme.palette.mode === "dark" ? "rgba(157, 80, 187, 0.1)" : "rgba(157, 80, 187, 0.08)",
                  },
                },
              }}
              TabIndicatorProps={{
                style: {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  background: "linear-gradient(90deg, #9d50bb, #6e48aa)",
                },
              }}
            >
              <Tab label="Personal Info" icon={<PersonIcon />} iconPosition="start" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
              <Tab
                label="Account"
                icon={<AccountCircleIcon />}
                iconPosition="start"
                id="profile-tab-1"
                aria-controls="profile-tabpanel-1"
              />
              <Tab label="Followers" icon={<GroupIcon />} iconPosition="start" id="profile-tab-2" aria-controls="profile-tabpanel-2" />
              <Tab label="Following" icon={<PeopleIcon />} iconPosition="start" id="profile-tab-3" aria-controls="profile-tabpanel-3" />
              <Tab label="Blocked" icon={<BlockIcon />} iconPosition="start" id="profile-tab-4" aria-controls="profile-tabpanel-4" />
              <Tab
                label="Reading History"
                icon={<HistoryIcon />}
                iconPosition="start"
                id="profile-tab-5"
                aria-controls="profile-tabpanel-5"
              />
              <Tab label="Preferences" icon={<CategoryIcon />} iconPosition="start" id="profile-tab-6" aria-controls="profile-tabpanel-6" />
              <Tab label="Purchases" icon={<CreditCard />} iconPosition="start" id="profile-tab-7" aria-controls="profile-tabpanel-7" />
            </Tabs>

            <Box sx={{ px: isMobile ? 0 : 2 }}>
              <TabPanel value={tabValue} index={0}>
                <PersonalInfo user={user} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <AccountInfo user={user} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <FollowersList userId={user.id} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <FollowingList userId={user.id} />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <BlockedUsersList />
              </TabPanel>
              <TabPanel value={tabValue} index={5}>
                <ReadingHistory userId={user.id} />
              </TabPanel>
              <TabPanel value={tabValue} index={6}>
                <UserPreferences />
              </TabPanel>
              <TabPanel value={tabValue} index={7}>
                <PurchaseHistory />
              </TabPanel>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
