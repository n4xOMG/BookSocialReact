import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardContent, Typography, Button, Stack, LinearProgress, Divider, TextField, Tooltip, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { getAuthorDashboard, getAuthorEarnings, getAuthorPayouts, requestAuthorPayout } from "../../redux/author/author.action";
import ProtectedRoute from "../../components/ProtectedRoute";

const StatCard = ({ title, value, subtitle, color = "primary" }) => (
  <Card>
    <CardContent>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const currency = (n) => (n == null ? "-$" : `$${Number(n).toFixed(2)}`);

const AuthorDashboardInner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboard, payoutsPage, loading, error, requestingPayout } = useSelector((s) => s.author, shallowEqual);
  const { user } = useSelector((s) => s.auth, shallowEqual);
  const [payoutAmount, setPayoutAmount] = useState(0);

  useEffect(() => {
    dispatch(getAuthorDashboard());
    dispatch(getAuthorEarnings(0, 5));
    dispatch(getAuthorPayouts(0, 5));
  }, [dispatch]);

  useEffect(() => {
    if (dashboard?.currentBalance != null) {
      setPayoutAmount(Number(dashboard.currentBalance));
    }
  }, [dashboard]);

  const growthText = useMemo(() => {
    const g = Number(dashboard?.earningsGrowthPercentage || 0);
    if (!g) return "0% vs last month";
    const sign = g >= 0 ? "+" : "";
    return `${sign}${g.toFixed(2)}% vs last month`;
  }, [dashboard]);

  const chartData = useMemo(() => {
    if (!dashboard) return [];
    // Simple two-point comparison: last month vs this month
    return [
      { label: "Last Month", value: Number(dashboard.lastMonthEarnings || 0) },
      { label: "This Month", value: Number(dashboard.currentMonthEarnings || 0) },
    ];
  }, [dashboard]);

  const handleRequestPayout = async () => {
    if (!dashboard) return;
    await dispatch(requestAuthorPayout(Number(payoutAmount)));
  };

  const canRequest = dashboard?.canRequestPayout && Number(payoutAmount) >= Number(dashboard?.minimumPayoutAmount || 0);

  if (loading && !dashboard) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Author Dashboard</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={user?.fullname || user?.username} />
          {dashboard?.payoutMethodConfigured ? (
            <Chip color="success" label="PayPal Configured" />
          ) : (
            <Tooltip title="Configure your PayPal email to receive payouts">
              <Button variant="contained" onClick={() => navigate("/author/payout-settings")}>
                Configure Payouts
              </Button>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {error && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography color="error">{String(error)}</Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Lifetime Earnings" value={currency(dashboard?.totalLifetimeEarnings)} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Paid Out" value={currency(dashboard?.totalPaidOut)} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Current Balance"
            value={currency(dashboard?.currentBalance)}
            subtitle={`Min payout ${currency(dashboard?.minimumPayoutAmount)}`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Avg Rating"
            value={(dashboard?.averageRating ?? 0).toFixed(2)}
            subtitle={`${dashboard?.totalLikes || 0} likes • ${dashboard?.totalComments || 0} comments`}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle1">Earnings</Typography>
                <Typography variant="body2" color="text.secondary">
                  {growthText}
                </Typography>
              </Stack>
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => `$${v}`} />
                    <RTooltip formatter={(v) => currency(v)} />
                    <Area type="monotone" dataKey="value" stroke="#1976d2" fillOpacity={1} fill="url(#colorE)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Request Payout
              </Typography>
              <Stack spacing={1}>
                <TextField
                  label="Amount"
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <Button variant="contained" disabled={!canRequest || requestingPayout} onClick={handleRequestPayout}>
                  {requestingPayout ? "Requesting..." : "Request Payout"}
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Minimum payout: {currency(dashboard?.minimumPayoutAmount)}{" "}
                  {dashboard?.payoutMethodConfigured ? "" : "• Configure PayPal in Settings"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Recent Earnings
              </Typography>
              <Divider />
              <Box component="table" sx={{ width: "100%", mt: 1 }}>
                <thead>
                  <tr>
                    <th align="left">Chapter</th>
                    <th align="left">Book</th>
                    <th align="right">Net</th>
                    <th align="left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(dashboard?.recentEarnings || []).map((e) => (
                    <tr key={e.id}>
                      <td>{e.chapterTitle || e.chapterNumber}</td>
                      <td>{e.bookTitle}</td>
                      <td align="right">{currency(e.netAmount)}</td>
                      <td>{e.earnedDate ? format(new Date(e.earnedDate), "MMM d, yyyy") : "-"}</td>
                    </tr>
                  ))}
                  {(!dashboard?.recentEarnings || dashboard?.recentEarnings.length === 0) && (
                    <tr>
                      <td colSpan={4}>
                        <Typography variant="body2" color="text.secondary">
                          No earnings yet
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Recent Payouts
              </Typography>
              <Divider />
              <Box component="table" sx={{ width: "100%", mt: 1 }}>
                <thead>
                  <tr>
                    <th align="left">Status</th>
                    <th align="right">Amount</th>
                    <th align="left">Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {(dashboard?.recentPayouts || []).map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Chip
                          size="small"
                          label={p.status}
                          color={p.status === "COMPLETED" ? "success" : p.status === "FAILED" ? "error" : "warning"}
                        />
                      </td>
                      <td align="right">{currency(p.totalAmount)}</td>
                      <td>{p.requestedDate ? format(new Date(p.requestedDate), "MMM d, yyyy") : "-"}</td>
                    </tr>
                  ))}
                  {(!dashboard?.recentPayouts || dashboard?.recentPayouts.length === 0) && (
                    <tr>
                      <td colSpan={3}>
                        <Typography variant="body2" color="text.secondary">
                          No payouts yet
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const AuthorDashboard = () => (
  <ProtectedRoute roles={["AUTHOR", "ADMIN"]}>
    <AuthorDashboardInner />
  </ProtectedRoute>
);

export default AuthorDashboard;
