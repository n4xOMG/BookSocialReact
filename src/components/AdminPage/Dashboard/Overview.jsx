import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  People as PeopleIcon,
  Book as BookIcon,
  MonetizationOn as MonetizationOnIcon,
  CreditCard as CreditCardIcon,
  PersonOff as PersonOffIcon,
} from "@mui/icons-material";

const Overview = () => {
  const metrics = [
    { title: "Total Users", icon: <PeopleIcon />, value: 1500 },
    { title: "Total Books", icon: <BookIcon />, value: 300 },
    { title: "Total Revenue", icon: <MonetizationOnIcon />, value: "$45,000" },
    { title: "Active Credit Packages", icon: <CreditCardIcon />, value: 5 },
    { title: "Suspended Users", icon: <PersonOffIcon />, value: 25 },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric) => (
        <Grid item xs={12} sm={6} md={4} key={metric.title}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center" }}>
            {metric.icon}
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6">{metric.value}</Typography>
              <Typography variant="subtitle1">{metric.title}</Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Overview;
