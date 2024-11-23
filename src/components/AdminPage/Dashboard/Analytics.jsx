import { Box, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { fetchCreditsData, fetchLockedUnlockedData, fetchRevenueData } from "../../utils/api"; // Adjust the path as needed

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Analytics = () => {
  const [creditsData, setCreditsData] = useState([]);
  const [lockedUnlockedData, setLockedUnlockedData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    const credits = await fetchCreditsData();
    const lockedUnlocked = await fetchLockedUnlockedData();
    const revenue = await fetchRevenueData();
    setCreditsData(credits);
    setLockedUnlockedData(lockedUnlocked);
    setRevenueData(revenue);
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

        {/* Credits Usage Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Credits Usage
            </Typography>
            <PieChart width={400} height={400}>
              <Pie data={lockedUnlockedData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {lockedUnlockedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
