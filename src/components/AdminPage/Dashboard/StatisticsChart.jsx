import React from "react";
import { useTheme } from "@mui/material/styles";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const StatisticsChart = ({ newUsersByMonth = [], booksByMonth = [] }) => {
  const theme = useTheme();

  // Month labels
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Use provided data or fallback to default mock data if API data isn't available yet
  const usersData = newUsersByMonth.length === 12 ? newUsersByMonth : [320, 290, 340, 380, 430, 460, 520, 590, 610, 650, 700, 750];

  const booksData = booksByMonth.length === 12 ? booksByMonth : [45, 52, 63, 59, 71, 75, 82, 90, 95, 103, 110, 121];

  // Sales data (still mocked since we don't have monthly sales data)
  const salesData = [48, 42, 53, 56, 61, 65, 70, 73, 80, 85, 92, 98];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Sales ($k)",
        data: salesData,
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
        data: usersData,
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
      {
        label: "Book Uploads",
        data: booksData,
        borderColor: theme.palette.success.main,
        backgroundColor: "transparent",
        tension: 0.3,
        pointBackgroundColor: theme.palette.success.main,
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
          text: "Sales ($k)",
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
          text: "Users & Books",
        },
      },
    },
  };

  return <Line options={options} data={data} />;
};

StatisticsChart.propTypes = {
  newUsersByMonth: PropTypes.array,
  booksByMonth: PropTypes.array,
};

export default StatisticsChart;
