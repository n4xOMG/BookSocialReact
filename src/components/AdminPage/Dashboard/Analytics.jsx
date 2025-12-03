import { Box, Grid, Paper, Typography, CircularProgress, Alert } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import {
  fetchUserAnalytics,
  fetchRevenueAnalytics,
  fetchContentAnalytics,
  fetchPlatformAnalytics,
} from "../../../redux/admin/admin.action";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const Analytics = () => {
  const dispatch = useDispatch();

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

  if (hasError) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Analytics & Insights
        </Typography>
        <Alert severity="error">Failed to load analytics data. Please try refreshing the page.</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Analytics & Insights
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Format data for charts
  const formatUserGrowthData = () => {
    if (!userAnalytics?.userGrowthHistory) return [];
    return userAnalytics.userGrowthHistory.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      newUsers: item.newUsers,
      totalUsers: item.totalUsers,
    }));
  };

  const formatRevenueData = () => {
    if (!revenueAnalytics?.dailyRevenueHistory) return [];
    return revenueAnalytics.dailyRevenueHistory.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      revenue: parseFloat(item.amount),
    }));
  };

  const formatPaymentProviderData = () => {
    if (!revenueAnalytics?.paymentProviderStats) return [];
    return revenueAnalytics.paymentProviderStats.map((provider) => ({
      name: provider.provider,
      value: parseFloat(provider.totalRevenue),
      percentage: provider.percentage,
    }));
  };

  const formatPopularBooksData = () => {
    if (!contentAnalytics?.popularBooks) return [];
    return contentAnalytics.popularBooks.slice(0, 10).map((book) => ({
      title: book.title.length > 20 ? book.title.substring(0, 20) + "..." : book.title,
      views: book.viewCount,
      unlocks: book.unlockCount,
      rating: book.rating,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics & Insights
      </Typography>
      <Grid container spacing={3}>
        {/* User Growth Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              User Growth History
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={formatUserGrowthData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="newUsers" stroke="#8884d8" name="New Users" />
                <Line type="monotone" dataKey="totalUsers" stroke="#82ca9d" name="Total Users" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Daily Revenue History
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={formatRevenueData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ffc658" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Payment Provider Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Payment Provider Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={formatPaymentProviderData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {formatPaymentProviderData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Popular Books Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Popular Books Performance
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={formatPopularBooksData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="unlocks" fill="#82ca9d" name="Unlocks" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Content Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Content Statistics Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {contentAnalytics?.totalBooks?.toLocaleString() || "0"}
                  </Typography>
                  <Typography variant="body2">Total Books</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary">
                    {contentAnalytics?.totalChapters?.toLocaleString() || "0"}
                  </Typography>
                  <Typography variant="body2">Total Chapters</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {contentAnalytics?.totalUnlocks?.toLocaleString() || "0"}
                  </Typography>
                  <Typography variant="body2">Total Unlocks</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {contentAnalytics?.popularAuthors?.length || "0"}
                  </Typography>
                  <Typography variant="body2">Active Authors</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

return (
  <Box>
    <Typography variant="h4" gutterBottom>
      Analytics & Insights
    </Typography>
    <Grid container spacing={3}>
      {/* Credits Purchased vs. Spent */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Credits Purchased vs. Spent
          </Typography>
          <LineChart width={500} height={300} data={creditsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="purchased" stroke="#8884d8" />
            <Line type="monotone" dataKey="spent" stroke="#82ca9d" />
          </LineChart>
        </Paper>
      </Grid>

      {/* Revenue Statistics */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Revenue Statistics
          </Typography>
          <LineChart width={500} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#ffc658" />
          </LineChart>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default Analytics;
