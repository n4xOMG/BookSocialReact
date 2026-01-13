import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  useTheme,
  Alert,
  CircularProgress
} from "@mui/material";
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  MenuBook as BookIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  fetchUserAnalytics,
  fetchRevenueAnalytics,
  fetchContentAnalytics,
  fetchPlatformAnalytics,
} from "../../../redux/admin/admin.action";
import StatisticsChart from "./StatisticsChart";

const StatCard = ({ title, value, icon, change, color, theme }) => (
  <Card
    sx={{
      height: "100%",
      borderRadius: "16px",
      boxShadow: theme.shadows[2],
      transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows[6],
      },
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="600">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="700" sx={{ color: theme.palette.text.primary, my: 1 }}>
            {value}
          </Typography>
          {change && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <TrendingUpIcon fontSize="small" sx={{ color: change >= 0 ? "success.main" : "error.main" }} />
              <Typography variant="body2" color={change >= 0 ? "success.main" : "error.main"} fontWeight="500">
                {change > 0 ? "+" : ""}{change}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                vs last month
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: color,
            color: "white",
            width: 48,
            height: 48,
            borderRadius: "12px",
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Overview = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const {
    userAnalytics,
    revenueAnalytics,
    contentAnalytics,
    userAnalyticsLoading,
    revenueAnalyticsLoading,
    contentAnalyticsLoading,
    userAnalyticsError,
    revenueAnalyticsError,
    contentAnalyticsError,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUserAnalytics());
    dispatch(fetchRevenueAnalytics());
    dispatch(fetchContentAnalytics());
    dispatch(fetchPlatformAnalytics());
  }, [dispatch]);

  const isLoading = userAnalyticsLoading || revenueAnalyticsLoading || contentAnalyticsLoading;
  const hasError = userAnalyticsError || revenueAnalyticsError || contentAnalyticsError;

  if (isLoading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
  if (hasError) return <Alert severity="error">Error loading analytics data</Alert>;

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" className="font-serif" fontWeight="700" sx={{ color: theme.palette.text.primary, mb: 1 }}>
          Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, Admin. Here's what's happening with your platform today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={userAnalytics?.totalUsers?.toLocaleString() || "0"}
            icon={<PeopleIcon />}
            change={userAnalytics?.userGrowthRate}
            color={theme.palette.primary.main}
            theme={theme}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${revenueAnalytics?.totalRevenue?.toLocaleString() || "0"}`}
            icon={<MoneyIcon />}
            change={revenueAnalytics?.revenueGrowthRate}
            color={theme.palette.success.main}
            theme={theme}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Books"
            value={contentAnalytics?.totalBooks?.toLocaleString() || "0"}
            icon={<BookIcon />}
            change={contentAnalytics?.contentGrowthRate}
            color={theme.palette.warning.main}
            theme={theme}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Chapter Unlocks"
            value={contentAnalytics?.totalUnlocks?.toLocaleString() || "0"}
            icon={<TrendingUpIcon />}
            color={theme.palette.info.main}
            theme={theme}
          />
        </Grid>
      </Grid>

      {/* Main Chart */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "16px",
          border: "1px solid",
          borderColor: theme.palette.divider,
          height: 480,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Revenue & User Growth
        </Typography>
        <Box sx={{ height: 400 }}>
          <StatisticsChart
            revenueData={revenueAnalytics?.dailyRevenueHistory}
            userGrowthData={userAnalytics?.userGrowthHistory}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Overview;
