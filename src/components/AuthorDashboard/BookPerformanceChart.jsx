import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tab,
  Tabs,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Remove, Visibility, Favorite, Comment } from "@mui/icons-material";
import { format } from "date-fns";

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const TrendIcon = ({ value }) => {
  if (value > 0) return <TrendingUp color="success" fontSize="small" />;
  if (value < 0) return <TrendingDown color="error" fontSize="small" />;
  return <Remove color="disabled" fontSize="small" />;
};

const BookPerformanceChart = ({ bookPerformance, loading }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Book Performance Analytics
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  if (!bookPerformance || bookPerformance.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Book Performance Analytics
          </Typography>
          <Typography color="text.secondary">No book performance data available</Typography>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const chartData = bookPerformance.map((book) => ({
    name: book.title.length > 15 ? book.title.substring(0, 15) + "..." : book.title,
    fullTitle: book.title,
    views: book.currentViews,
    favorites: book.currentFavourites,
    comments: book.currentComments,
    dailyViewsGrowth: book.dailyViewsGrowth,
    weeklyViewsGrowth: book.weeklyViewsGrowth,
    monthlyViewsGrowth: book.monthlyViewsGrowth,
  }));

  // Colors for pie chart - expanded palette
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF7C7C",
    "#8DD1E1",
    "#87D068",
    "#FFB347",
    "#DDA0DD",
    "#98FB98",
    "#F0E68C",
    "#FF69B4",
    "#40E0D0",
    "#EE82EE",
    "#90EE90",
  ];

  const pieData = bookPerformance
    .filter((book) => book.currentViews > 0) // Only include books with views
    .sort((a, b) => b.currentViews - a.currentViews) // Sort by views descending
    .slice(0, 10) // Limit to top 10 books for better visualization
    .map((book, index) => ({
      name: book.title.length > 25 ? book.title.substring(0, 25) + "..." : book.title,
      fullTitle: book.title,
      value: book.currentViews,
      color: COLORS[index % COLORS.length],
    }));

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Book Performance Analytics
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Overview Chart" />
            <Tab label="Growth Trends" />
            <Tab label="Detailed Table" />
            <Tab label="Views Distribution" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {chartData.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No Book Data Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload some books to see performance analytics
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatNumber} />
                  <RTooltip
                    formatter={(value, name) => [formatNumber(value), name]}
                    labelFormatter={(label) => {
                      const book = chartData.find((b) => b.name === label);
                      return book?.fullTitle || label;
                    }}
                  />
                  <Bar dataKey="views" fill="#8884d8" name="Views" />
                  <Bar dataKey="favorites" fill="#82ca9d" name="Favorites" />
                  <Bar dataKey="comments" fill="#ffc658" name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {chartData.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No Growth Data Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your books need some time to accumulate growth metrics
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatNumber} />
                  <RTooltip
                    formatter={(value, name) => [formatNumber(value), name]}
                    labelFormatter={(label) => {
                      const book = chartData.find((b) => b.name === label);
                      return book?.fullTitle || label;
                    }}
                  />
                  <Line type="monotone" dataKey="dailyViewsGrowth" stroke="#8884d8" name="Daily Growth" />
                  <Line type="monotone" dataKey="weeklyViewsGrowth" stroke="#82ca9d" name="Weekly Growth" />
                  <Line type="monotone" dataKey="monthlyViewsGrowth" stroke="#ffc658" name="Monthly Growth" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {bookPerformance.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No Books Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start by uploading your first book to see detailed analytics
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Views</TableCell>
                    <TableCell align="right">Favorites</TableCell>
                    <TableCell align="right">Comments</TableCell>
                    <TableCell align="center">Growth (D/W/M)</TableCell>
                    <TableCell align="right">Chapters</TableCell>
                    <TableCell align="right">Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookPerformance.map((book) => (
                    <TableRow key={book.bookId} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar src={book.bookCover} alt={book.title} sx={{ width: 40, height: 40 }} />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {book.title}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={book.status} color={book.status === "PUBLISHED" ? "success" : "warning"} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                          <Visibility fontSize="small" color="action" />
                          {formatNumber(book.currentViews)}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                          <Favorite fontSize="small" color="action" />
                          {formatNumber(book.currentFavourites)}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                          <Comment fontSize="small" color="action" />
                          {formatNumber(book.currentComments)}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <TrendIcon value={book.dailyViewsGrowth} />
                            <Typography variant="caption">{formatNumber(book.dailyViewsGrowth)}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <TrendIcon value={book.weeklyViewsGrowth} />
                            <Typography variant="caption">{formatNumber(book.weeklyViewsGrowth)}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <TrendIcon value={book.monthlyViewsGrowth} />
                            <Typography variant="caption">{formatNumber(book.monthlyViewsGrowth)}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{book.totalChapters}</TableCell>
                      <TableCell align="right">{book.lastUpdated ? format(new Date(book.lastUpdated), "MMM d, yyyy") : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {pieData.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No Views Data Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your books need to have views to see the distribution chart
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: 500 }}>
              <Grid container spacing={3} sx={{ height: "100%" }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box sx={{ height: "100%" }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, textAlign: "center" }}>
                      Views Distribution Across Your Books
                    </Typography>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent, value }) => (percent > 5 ? `${name}: ${(percent * 100).toFixed(0)}%` : "")}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="#fff"
                          strokeWidth={2}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RTooltip
                          formatter={(value, name) => [formatNumber(value), "Views"]}
                          labelFormatter={(label) => `Book: ${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Top Performing Books
                    </Typography>
                    <Box sx={{ flex: 1, overflow: "auto" }}>
                      {pieData
                        .sort((a, b) => b.value - a.value)
                        .map((book, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor: "background.paper",
                              border: "1px solid",
                              borderColor: "divider",
                              "&:hover": {
                                bgcolor: "action.hover",
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
                              <Typography variant="h6" color="primary" sx={{ minWidth: 24 }}>
                                #{index + 1}
                              </Typography>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  backgroundColor: book.color,
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                }}
                              />
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                  title={book.name}
                                >
                                  {book.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatNumber(book.value)} views
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                              {((book.value / pieData.reduce((sum, b) => sum + b.value, 0)) * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                        Total Views Across All Books
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatNumber(pieData.reduce((sum, book) => sum + book.value, 0))}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default BookPerformanceChart;
