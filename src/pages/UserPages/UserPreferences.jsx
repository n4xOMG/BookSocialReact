import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, Chip, Divider, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getUserPreferences } from "../../redux/user/user.action";

const COLORS = ["#2196F3", "#FF9800", "#4CAF50", "#F44336", "#9C27B0", "#3F51B5", "#E91E63", "#00BCD4", "#8BC34A", "#FFC107"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
          {payload[0].name}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const UserPreferences = () => {
  const dispatch = useDispatch();
  const { preferredCategories, preferredTags, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserPreferences());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={300} height={24} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2, mb: 4 }} />
        <Skeleton variant="text" width={180} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Button variant="outlined" color="primary" sx={{ mt: 2, borderRadius: 2 }} onClick={() => dispatch(getUserPreferences())}>
          Try Again
        </Button>
      </Paper>
    );
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

  const noData = categoryData.length === 0 && tagData.length === 0;

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.background.paper }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h5" fontWeight="medium">
            Reading Preferences
          </Typography>
          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Update Preferences
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          These preferences help us recommend books that match your interests
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {noData ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" gutterBottom>
              No Preferences Set
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
              You haven't set any reading preferences yet. Update your preferences to get personalized book recommendations.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<TuneIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: "bold",
                px: 3,
                py: 1,
              }}
            >
              Set Your Preferences
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {categoryData.length > 0 && (
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <CategoryIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="medium">
                    Preferred Categories
                  </Typography>
                </Box>
                <Box sx={{ p: 1, mb: 3 }}>
                  {preferredCategories.map((cat) => (
                    <Chip
                      key={cat.id || cat.name}
                      label={cat.name}
                      sx={{
                        m: 0.5,
                        borderRadius: 6,
                        fontWeight: 500,
                      }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            )}

            {tagData.length > 0 && (
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <LocalOfferIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="medium">
                    Preferred Tags
                  </Typography>
                </Box>
                <Box sx={{ p: 1, mb: 3 }}>
                  {preferredTags.map((tag) => (
                    <Chip
                      key={tag.id || tag.name}
                      label={tag.name}
                      sx={{
                        m: 0.5,
                        borderRadius: 6,
                        fontWeight: 500,
                      }}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tagData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#82ca9d"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {tagData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

export default UserPreferences;
