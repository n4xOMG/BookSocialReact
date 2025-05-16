import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Paper, Typography, Card, CardContent, Divider, useTheme } from "@mui/material";
import {
  Book as BookIcon,
  CreditCard as CreditCardIcon,
  MonetizationOn as MonetizationOnIcon,
  Group as GroupIcon,
  LocalLibrary as LocalLibraryIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { fetchTotalNumberOfPurchases, fetchTotalSalesAmount } from "../../../redux/purchase/purchase.action";
import { getActiveCreditPackages } from "../../../redux/creditpackage/creditpackage.action";
import StatisticsChart from "./StatisticsChart";

const Overview = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { totalSales, totalPurchases } = useSelector((state) => state.purchase);
  const { activeCreditPackages } = useSelector((state) => state.creditpackage);

  // Additional mock data (replace with real data from Redux once available)
  const totalUsers = 5842;
  const totalBooks = 12763;
  const activeReaders = 3291;
  const monthlyGrowth = 12.5;

  const metrics = [
    {
      title: "Total Users",
      icon: <GroupIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      value: totalUsers.toLocaleString(),
      change: "+14% from last month",
      positive: true,
    },
    {
      title: "Total Books",
      icon: <LocalLibraryIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      value: totalBooks.toLocaleString(),
      change: "+8% from last month",
      positive: true,
    },
    {
      title: "Active Readers",
      icon: <BookIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      value: activeReaders.toLocaleString(),
      change: "+5% from last month",
      positive: true,
    },
    {
      title: "Total Purchases",
      icon: <BarChartIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      value: totalPurchases?.toLocaleString() || "0",
      change: "+6% from last month",
      positive: true,
    },
    {
      title: "Total Revenue",
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      value: `$${totalSales?.toLocaleString() || "0"}`,
      change: "+10% from last month",
      positive: true,
    },
    {
      title: "Monthly Growth",
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      value: `${monthlyGrowth}%`,
      change: "Increasing trend",
      positive: true,
    },
  ];

  const secondaryMetrics = [
    {
      title: "Active Credit Packages",
      icon: <CreditCardIcon sx={{ fontSize: 30, color: theme.palette.grey[700] }} />,
      value: activeCreditPackages?.length || 0,
      description: "Credit packages currently available for purchase",
    },
    {
      title: "Popular Genre",
      icon: <BookIcon sx={{ fontSize: 30, color: theme.palette.grey[700] }} />,
      value: "Science Fiction",
      description: "Most purchased genre this month",
    },
    {
      title: "Average Reading Time",
      icon: <LocalLibraryIcon sx={{ fontSize: 30, color: theme.palette.grey[700] }} />,
      value: "45 mins",
      description: "Daily average across all active users",
    },
  ];

  useEffect(() => {
    // Fetch all admin statistics on component mount
    dispatch(getActiveCreditPackages());
    dispatch(fetchTotalSalesAmount());
    dispatch(fetchTotalNumberOfPurchases());
    // Add other statistics fetching here
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="500" sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      {/* Main metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric) => (
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
                <Typography variant="caption" color={metric.positive ? "success.main" : "error.main"} sx={{ display: "block", mt: 1 }}>
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
          Monthly Sales & User Growth
        </Typography>
        <StatisticsChart />
      </Paper>

      {/* Additional metrics row */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Additional Insights
      </Typography>
      <Grid container spacing={3}>
        {secondaryMetrics.map((metric) => (
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
    </Box>
  );
};

export default Overview;
