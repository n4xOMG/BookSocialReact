import CategoryIcon from "@mui/icons-material/Category";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";
import { Alert, Box, Card, CardContent, CircularProgress, Container, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TabPanel } from "../../components/BookDetailPageComponents/ChapterListComponent/TabPanel";
import AccountInfo from "../../components/ProfilePage/AccountInfo";
import FollowersList from "../../components/ProfilePage/FollowersList";
import FollowingList from "../../components/ProfilePage/FollowingList.jsx";
import PersonalInfo from "../../components/ProfilePage/PersonalInfo";
import ReadingHistory from "../../components/ProfilePage/ReadingHistory";
import { getCurrentUserByJwt } from "../../redux/auth/auth.action";
import UserPreferences from "./UserPreferences";
import Header from "../../components/HomePage/Header.jsx";

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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain", flexDirection: "column" }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {user.fullname}'s Profile
            </Typography>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Personal Info" icon={<PeopleIcon />} iconPosition="start" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
              <Tab
                label="Account Info"
                icon={<FavoriteIcon />}
                iconPosition="start"
                id="profile-tab-1"
                aria-controls="profile-tabpanel-1"
              />
              <Tab label="Followers" icon={<PeopleIcon />} iconPosition="start" id="profile-tab-2" aria-controls="profile-tabpanel-2" />
              <Tab label="Following" icon={<PeopleIcon />} iconPosition="start" id="profile-tab-3" aria-controls="profile-tabpanel-3" />
              <Tab
                label="Reading History"
                icon={<HistoryIcon />}
                iconPosition="start"
                id="profile-tab-4"
                aria-controls="profile-tabpanel-4"
              />
              <Tab label="Preferences" icon={<CategoryIcon />} iconPosition="start" id="profile-tab-5" aria-controls="profile-tabpanel-5" />
            </Tabs>
            {/* Tab Panels */}
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
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
