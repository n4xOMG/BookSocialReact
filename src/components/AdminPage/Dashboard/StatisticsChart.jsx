import React from "react";
import { useTheme } from "@mui/material/styles";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const StatisticsChart = ({ revenueData = [], userGrowthData = [] }) => {
  const theme = useTheme();

  // Process data for the chart
  const processData = () => {
    // If we have actual data, use it. Otherwise, use mock data
    if (revenueData.length > 0 || userGrowthData.length > 0) {
      const labels = [];
      const revenueValues = [];
      const userValues = [];

      // Get the last 12 months of data
      const last12Months = [...Array(12)].map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleDateString("en-US", { month: "short" });
      });

      // Fill with actual data or zeros
      last12Months.forEach((month) => {
        labels.push(month);

        // Find revenue for this month
        const revenueItem = revenueData.find((item) => new Date(item.date).toLocaleDateString("en-US", { month: "short" }) === month);
        revenueValues.push(revenueItem ? parseFloat(revenueItem.amount) / 1000 : 0);

        // Find user growth for this month
        const userItem = userGrowthData.find((item) => new Date(item.date).toLocaleDateString("en-US", { month: "short" }) === month);
        userValues.push(userItem ? userItem.newUsers : 0);
      });

      return { labels, revenueValues, userValues };
    }

    // Fallback mock data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueValues = [48, 42, 53, 56, 61, 65, 70, 73, 80, 85, 92, 98];
    const userValues = [320, 290, 340, 380, 430, 460, 520, 590, 610, 650, 700, 750];

    return { labels: months, revenueValues, userValues };
  };

  const { labels, revenueValues, userValues } = processData();

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue ($k)",
        data: revenueValues,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + "40",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "New Users",
        data: userValues,
        borderColor: theme.palette.secondary.main,
        backgroundColor: "transparent",
        tension: 0.3,
        borderDash: [5, 5],
        pointBackgroundColor: theme.palette.secondary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        usePointStyle: true,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        position: "left",
        grid: {
          color: theme.palette.divider,
        },
        title: {
          display: true,
          text: "Revenue ($k)",
        },
        ticks: {
          callback: function (value) {
            return "$" + value + "k";
          },
        },
      },
      y1: {
        position: "right",
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "New Users",
        },
      },
    },
  };

  return <Line options={options} data={data} />;
};

StatisticsChart.propTypes = {
  revenueData: PropTypes.array,
  userGrowthData: PropTypes.array,
};

export default StatisticsChart;
