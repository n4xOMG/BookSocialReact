import { CreditCard } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { Alert, Avatar, Box, Card, CardContent, CircularProgress, Container, Divider, Paper, Tab, Tabs, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TabPanel } from "../../components/BookDetailPageComponents/ChapterListComponent/TabPanel";
import Header from "../../components/HomePage/Header.jsx";
import AccountInfo from "../../components/ProfilePage/AccountInfo";
import FollowersList from "../../components/ProfilePage/FollowersList";
import FollowingList from "../../components/ProfilePage/FollowingList.jsx";
import PersonalInfo from "../../components/ProfilePage/PersonalInfo";
import PurchaseHistory from "../../components/ProfilePage/PurchaseHistory.jsx";
import ReadingHistory from "../../components/ProfilePage/ReadingHistory";
import { getCurrentUserByJwt } from "../../redux/auth/auth.action";
import UserPreferences from "./UserPreferences";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0); // State to manage active tab
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        const userData = await dispatch(getCurrentUserByJwt(jwt));
        setUser(userData.payload);
      } catch (err) {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100%", flexDirection: "column" }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, flex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            height: 200,
            borderRadius: "16px 16px 0 0",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            mb: -8,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "60%",
              background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
            }}
          />
        </Paper>

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            overflow: "visible",
            position: "relative",
          }}
        >
          <Avatar
            src={user.avatarUrl}
            alt={user.fullname}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              position: "absolute",
              top: -40,
              left: 40,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />

          <CardContent sx={{ pt: 10, pb: 2 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ ml: 2 }}>
              {user.fullname}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 2, mb: 4 }}>
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
                },
              }}
              TabIndicatorProps={{
                style: { height: 3, borderRadius: "3px 3px 0 0" },
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
              <Tab
                label="Reading History"
                icon={<HistoryIcon />}
                iconPosition="start"
                id="profile-tab-4"
                aria-controls="profile-tabpanel-4"
              />
              <Tab label="Preferences" icon={<CategoryIcon />} iconPosition="start" id="profile-tab-5" aria-controls="profile-tabpanel-5" />
              <Tab label="Purchases" icon={<CreditCard />} iconPosition="start" id="profile-tab-6" aria-controls="profile-tabpanel-6" />
            </Tabs>

            <Box sx={{ px: 2 }}>
              <TabPanel value={tabValue} index={0}>
                <PersonalInfo user={user} setUser={setUser} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <AccountInfo user={user} setUser={setUser} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <FollowersList userId={user.id} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <FollowingList userId={user.id} />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <ReadingHistory userId={user.id} />
              </TabPanel>
              <TabPanel value={tabValue} index={5}>
                <UserPreferences />
              </TabPanel>
              <TabPanel value={tabValue} index={6}>
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
