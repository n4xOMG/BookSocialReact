import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Paper, Typography, useTheme, Box } from "@mui/material";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategoryStats = ({ stats = [] }) => {
  const theme = useTheme();

  const data = {
    labels: stats.map((item) => item.categoryName || "Unknown"),
    datasets: [
      {
        label: "Books Count",
        data: stats.map((item) => item.bookCount || item.count || 0),
        backgroundColor: theme.palette.primary.main + "80", // 50% opacity
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: theme.palette.primary.main,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        display: false, // Hide legend for single dataset
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Paper elevation={0} sx={{ p: 2, height: "100%", borderRadius: "16px", border: "1px solid", borderColor: theme.palette.divider }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Category Distribution
      </Typography>
      <Box sx={{ height: 300, width: "100%" }}>
        {stats.length > 0 ? (
           <Bar data={data} options={options} />
        ) : (
           <Box display="flex" alignItems="center" justifyContent="center" height="100%">
             <Typography variant="body2" color="text.secondary">No category data available</Typography>
           </Box>
        )}
      </Box>
    </Paper>
  );
};

CategoryStats.propTypes = {
  stats: PropTypes.array,
};

export default CategoryStats;
