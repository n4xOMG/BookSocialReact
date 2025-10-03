import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Paper, Typography, Card, CardContent, Divider, useTheme, CircularProgress, Alert } from "@mui/material";
import {
  Book as BookIcon,
  MonetizationOn as MonetizationOnIcon,
  Group as GroupIcon,
  LocalLibrary as LocalLibraryIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import {
  fetchUserAnalytics,
  fetchRevenueAnalytics,
  fetchContentAnalytics,
  fetchPlatformAnalytics,
} from "../../../redux/admin/admin.action";
import StatisticsChart from "./StatisticsChart";

const Overview = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const {
    userAnalytics,
    revenueAnalytics,
    contentAnalytics,
    platformAnalytics,
    userAnalyticsLoading,
    revenueAnalyticsLoading,
    contentAnalyticsLoading,
    platformAnalyticsLoading,
    userAnalyticsError,
    revenueAnalyticsError,
    contentAnalyticsError,
    platformAnalyticsError,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    // Fetch all admin analytics on component mount
    dispatch(fetchUserAnalytics());
    dispatch(fetchRevenueAnalytics());
    dispatch(fetchContentAnalytics());
    dispatch(fetchPlatformAnalytics());
  }, [dispatch]);

  const isLoading = userAnalyticsLoading || revenueAnalyticsLoading || contentAnalyticsLoading || platformAnalyticsLoading;
  const hasError = userAnalyticsError || revenueAnalyticsError || contentAnalyticsError || platformAnalyticsError;

  // Calculate metrics from analytics data
  const getMetrics = () => {
    if (!userAnalytics || !revenueAnalytics || !contentAnalytics) {
      return [];
    }

    return [
      {
        title: "Total Users",
        icon: <GroupIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
        value: userAnalytics.totalUsers?.toLocaleString() || "0",
        change: `${userAnalytics.newUsersThisMonth || 0} new this month`,
        positive: true,
      },
      {
        title: "Total Books",
        icon: <LocalLibraryIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
        value: contentAnalytics.totalBooks?.toLocaleString() || "0",
        change: `${contentAnalytics.totalChapters || 0} chapters`,
        positive: true,
      },
      {
        title: "Active Users",
        icon: <BookIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
        value: userAnalytics.activeUsers?.toLocaleString() || "0",
        change: "Last 30 days",
        positive: true,
      },
      {
        title: "Total Unlocks",
        icon: <BarChartIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
        value: contentAnalytics.totalUnlocks?.toLocaleString() || "0",
        change: "Chapter unlocks",
        positive: true,
      },
      {
        title: "Total Revenue",
        icon: <MonetizationOnIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
        value: `$${revenueAnalytics.totalRevenue?.toLocaleString() || "0"}`,
        change: `$${revenueAnalytics.monthlyRevenue?.toLocaleString() || "0"} this month`,
        positive: true,
      },
    ];
  };

  const getSecondaryMetrics = () => {
    if (!userAnalytics || !revenueAnalytics || !platformAnalytics) {
      return [];
    }

    return [
      {
        title: "Banned Users",
        icon: <BlockIcon sx={{ fontSize: 30, color: theme.palette.error.main }} />,
        value: userAnalytics.bannedUsers || 0,
        description: "Users currently banned",
      },
      {
        title: "Platform Earnings",
        icon: <MonetizationOnIcon sx={{ fontSize: 30, color: theme.palette.success.main }} />,
        value: `$${platformAnalytics.platformFeeEarnings?.toLocaleString() || "0"}`,
        description: "Platform fee earnings",
      },
      {
        title: "Reports",
        icon: <AssessmentIcon sx={{ fontSize: 30, color: theme.palette.warning.main }} />,
        value: platformAnalytics.totalReports || 0,
        description: `${platformAnalytics.pendingReports || 0} pending`,
      },
    ];
  };

  if (hasError) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="500" sx={{ mb: 4 }}>
          Dashboard Overview
        </Typography>
        <Alert severity="error">Failed to load analytics data. Please try refreshing the page.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="500" sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Main metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {getMetrics().map((metric) => (
              <Grid item xs={12} sm={6} md={4} key={metric.title}>
                <Card
                  elevation={1}
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Box>{metric.icon}</Box>
                      <Typography variant="h4" fontWeight="bold">
                        {metric.value}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      {metric.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                      {metric.change}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Chart Section */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              height: 400,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Monthly Revenue & Growth
            </Typography>
            <StatisticsChart
              revenueData={revenueAnalytics?.dailyRevenueHistory || []}
              userGrowthData={userAnalytics?.userGrowthHistory || []}
            />
          </Paper>

          {/* Additional metrics row */}
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Additional Insights
          </Typography>
          <Grid container spacing={3}>
            {getSecondaryMetrics().map((metric) => (
              <Grid item xs={12} sm={4} key={metric.title}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
                    {metric.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {metric.title}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="h5" fontWeight="medium" sx={{ mb: 1 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Overview;
