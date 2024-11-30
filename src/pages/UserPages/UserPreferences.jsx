import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, CircularProgress } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getUserPreferences } from "../../redux/user/user.action";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#FF6384", "#36A2EB", "#FFCE56", "#9966FF", "#FF9F40"];

const UserPreferences = () => {
  const dispatch = useDispatch();
  const { preferredCategories, preferredTags, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserPreferences());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  // Prepare data for PieChart
  const categoryData = preferredCategories.map((cat) => ({
    name: cat.name,
    value: 1, // Since weights are normalized, you can adjust to show distribution
  }));

  const tagData = preferredTags.map((tag) => ({
    name: tag.name,
    value: 1,
  }));

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Your Preferred Categories</Typography>
      <PieChart width={400} height={400}>
        <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Your Preferred Tags
      </Typography>
      <PieChart width={400} height={400}>
        <Pie data={tagData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#82ca9d" label>
          {tagData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Box>
  );
};

export default UserPreferences;
