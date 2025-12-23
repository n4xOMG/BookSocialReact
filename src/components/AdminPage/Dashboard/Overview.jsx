import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Paper, Typography, Card, CardContent, Divider, useTheme, CircularProgress, Alert, Container } from "@mui/material";
import {
  Book as BookIcon,
  MonetizationOn as MonetizationOnIcon,
  Group as GroupIcon,
  LocalLibrary as LocalLibraryIcon,
  BarChart as BarChartIcon,
  Block as BlockIcon,
  Assessment as AssessmentIcon,
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
    elevation={0}
    sx={{
      height: "100%",
      borderRadius: "16px",
      bgcolor: theme.palette.background.paper,
      border: "1px solid",
      borderColor: theme.palette.divider,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows[4],
        borderColor: color,
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            bgcolor: `${color}15`,
            color: color,
          }}
        >
          {icon}
        </Box>
        {change && (
          <Typography variant="caption" sx={{ color: theme.palette.success.main, fontWeight: 600, display: "flex", alignItems: "center" }}>
            <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
            {change}
          </Typography>
        )}
      </Box>
      <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5, color: theme.palette.text.primary }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight="500">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

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
    dispatch(fetchUserAnalytics());
    dispatch(fetchRevenueAnalytics());
    dispatch(fetchContentAnalytics());
    dispatch(fetchPlatformAnalytics());
  }, [dispatch]);

  const isLoading = userAnalyticsLoading || revenueAnalyticsLoading || contentAnalyticsLoading || platformAnalyticsLoading;
  const hasError = userAnalyticsError || revenueAnalyticsError || contentAnalyticsError || platformAnalyticsError;

  const getMetrics = () => {
    if (!userAnalytics || !revenueAnalytics || !contentAnalytics) return [];

    return [
      {
        title: "Total Users",
        icon: <GroupIcon />,
        value: userAnalytics.totalUsers?.toLocaleString() || "0",
        change: userAnalytics.newUsersThisMonth ? `+${userAnalytics.newUsersThisMonth} this month` : null,
        color: theme.palette.primary.main,
      },
      {
        title: "Total Revenue",
        icon: <MonetizationOnIcon />,
        value: `$${revenueAnalytics.totalRevenue?.toLocaleString() || "0"}`,
        change: revenueAnalytics.monthlyRevenue ? `+$${revenueAnalytics.monthlyRevenue} this month` : null,
        color: theme.palette.success.main,
      },
      {
        title: "Total Books",
        icon: <LocalLibraryIcon />,
        value: contentAnalytics.totalBooks?.toLocaleString() || "0",
        change: contentAnalytics.totalChapters ? `${contentAnalytics.totalChapters} chapters` : null,
        color: theme.palette.secondary.main,
      },
      {
        title: "Chapter Unlocks",
        icon: <BarChartIcon />,
        value: contentAnalytics.totalUnlocks?.toLocaleString() || "0",
        change: null,
        color: theme.palette.info.main,
      },
    ];
  };

  const getSecondaryMetrics = () => {
    if (!userAnalytics || !platformAnalytics) return [];

    return [
      {
        title: "Active Users (30d)",
        icon: <BookIcon />,
        value: userAnalytics.activeUsers?.toLocaleString() || "0",
        description: "Users active in last 30 days",
        color: theme.palette.primary.main,
      },
      {
        title: "Platform Earnings",
        icon: <MonetizationOnIcon />,
        value: `$${platformAnalytics.platformFeeEarnings?.toLocaleString() || "0"}`,
        description: "Total platform fees collected",
        color: theme.palette.success.main,
      },
      {
        title: "Pending Reports",
        icon: <AssessmentIcon />,
        value: platformAnalytics.pendingReports?.toLocaleString() || "0",
        description: `${platformAnalytics.totalReports || 0} total reports`,
        color: theme.palette.warning.main,
      },
      {
        title: "Banned Users",
        icon: <BlockIcon />,
        value: userAnalytics.bannedUsers?.toLocaleString() || "0",
        description: `${userAnalytics.suspendedUsers || 0} suspended`,
        color: theme.palette.error.main,
      },
    ];
  };

  if (hasError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          Failed to load analytics data. Please try refreshing the page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" className="font-serif" fontWeight="700" sx={{ color: theme.palette.text.primary }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, Admin. Here's what's happening today.
        </Typography>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={40} thickness={4} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {getMetrics().map((metric) => (
              <Grid item xs={6} sm={6} md={3} key={metric.title}>
                <StatCard {...metric} theme={theme} />
              </Grid>
            ))}
          </Grid>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: "16px",
              bgcolor: theme.palette.background.paper,
              border: "1px solid",
              borderColor: theme.palette.divider,
              height: 450,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="700">
                Revenue & Growth
              </Typography>
            </Box>
            <StatisticsChart
              revenueData={revenueAnalytics?.dailyRevenueHistory || []}
              userGrowthData={userAnalytics?.userGrowthHistory || []}
            />
          </Paper>

          <Typography variant="h5" className="font-serif" fontWeight="700" sx={{ mb: 3, color: theme.palette.text.primary }}>
            Platform Insights
          </Typography>
          <Grid container spacing={3}>
            {getSecondaryMetrics().map((metric) => (
              <Grid item xs={6} sm={6} md={3} key={metric.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: "16px",
                    bgcolor: theme.palette.background.paper,
                    border: "1px solid",
                    borderColor: theme.palette.divider,
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: metric.color,
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "8px",
                        bgcolor: `${metric.color}15`,
                        color: metric.color,
                        mr: 2,
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Typography variant="subtitle1" fontWeight="600">
                      {metric.title}
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
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
