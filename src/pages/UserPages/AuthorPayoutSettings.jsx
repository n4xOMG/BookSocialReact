import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  LinearProgress,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Divider,
} from "@mui/material";
import { getPayoutSettings, updatePayoutSettings } from "../../redux/author/author.action";
import ProtectedRoute from "../../components/ProtectedRoute";
import { format, addDays, addMonths } from "date-fns";
import { getAuthorDashboard } from "../../redux/author/author.action";

const Inner = () => {
  const dispatch = useDispatch();
  const { payoutSettings, loading, error, dashboard } = useSelector((s) => s.author);
  const [form, setForm] = useState({ paypalEmail: "", minimumPayoutAmount: 0, payoutFrequency: "MONTHLY", autoPayoutEnabled: false });
  const [saving, setSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    dispatch(getPayoutSettings());
    dispatch(getAuthorDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (payoutSettings) {
      setForm({
        paypalEmail: payoutSettings.paypalEmail || "",
        minimumPayoutAmount: Number(payoutSettings.minimumPayoutAmount || 0),
        payoutFrequency: payoutSettings.payoutFrequency || "MONTHLY",
        autoPayoutEnabled: Boolean(payoutSettings.autoPayoutEnabled),
      });
    }
  }, [payoutSettings]);

  const canSave = useMemo(() => form.paypalEmail && form.minimumPayoutAmount >= 0, [form]);

  const isValidEmail = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

  useEffect(() => {
    if (!form.paypalEmail) setEmailError("PayPal email is required");
    else if (!isValidEmail(form.paypalEmail)) setEmailError("Enter a valid email address");
    else setEmailError("");
  }, [form.paypalEmail]);

  const handleSave = async () => {
    setSaving(true);
    const res = await dispatch(updatePayoutSettings(form));
    setSaving(false);
    return res;
  };

  const nextAutoPayoutDate = useMemo(() => {
    if (!form.autoPayoutEnabled) return null;
    const now = new Date();
    switch (form.payoutFrequency) {
      case "WEEKLY":
        return addDays(now, 7);
      case "BIWEEKLY":
        return addDays(now, 14);
      case "MONTHLY":
      default:
        return addMonths(now, 1);
    }
  }, [form.autoPayoutEnabled, form.payoutFrequency]);

  if (loading && !payoutSettings)
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Payout Settings
      </Typography>
      {error && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography color="error">{String(error)}</Typography>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1">PayPal</Typography>
              {payoutSettings?.paypalEmail ? <Chip color="success" label="Configured" /> : <Chip color="warning" label="Not configured" />}
            </Stack>
            <TextField
              label="PayPal Email"
              type="email"
              value={form.paypalEmail}
              onChange={(e) => setForm((f) => ({ ...f, paypalEmail: e.target.value }))}
              fullWidth
              error={!!emailError}
              helperText={emailError || ""}
            />
            <TextField
              label="Minimum Payout Amount"
              type="number"
              value={form.minimumPayoutAmount}
              onChange={(e) => setForm((f) => ({ ...f, minimumPayoutAmount: Number(e.target.value) }))}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              select
              label="Payout Frequency"
              value={form.payoutFrequency}
              onChange={(e) => setForm((f) => ({ ...f, payoutFrequency: e.target.value }))}
            >
              <MenuItem value="WEEKLY">Weekly</MenuItem>
              <MenuItem value="BIWEEKLY">Bi-weekly</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={form.autoPayoutEnabled}
                  onChange={(e) => setForm((f) => ({ ...f, autoPayoutEnabled: e.target.checked }))}
                />
              }
              label="Enable auto payouts"
            />
            <Divider />
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">Summary</Typography>
              <Typography variant="body2" color="text.secondary">
                Unpaid balance: {dashboard ? `$${Number(dashboard.currentBalance ?? 0).toFixed(2)}` : "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next auto-payout: {form.autoPayoutEnabled && nextAutoPayoutDate ? format(nextAutoPayoutDate, "MMM d, yyyy") : "Disabled"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" disabled={!canSave || !!emailError || saving} onClick={handleSave}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

const AuthorPayoutSettings = () => (
  <ProtectedRoute roles={["USER", "ADMIN"]}>
    <Inner />
  </ProtectedRoute>
);

export default AuthorPayoutSettings;
