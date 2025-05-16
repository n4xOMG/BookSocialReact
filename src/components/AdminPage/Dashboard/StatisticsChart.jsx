import React from "react";
import { useTheme } from "@mui/material/styles";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const StatisticsChart = () => {
  const theme = useTheme();

  // Mock data - replace with actual data from your Redux store
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Sales data (in thousands)
  const salesData = [48, 42, 53, 56, 61, 65, 70, 73, 80, 85, 92, 98];

  // New users data
  const newUsersData = [320, 290, 340, 380, 430, 460, 520, 590, 610, 650, 700, 750];

  // Book uploads data
  const bookUploadsData = [45, 52, 63, 59, 71, 75, 82, 90, 95, 103, 110, 121];

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
        data: newUsersData,
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
        data: bookUploadsData,
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

export default StatisticsChart;
