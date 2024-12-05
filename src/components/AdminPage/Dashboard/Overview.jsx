import { Book as BookIcon, CreditCard as CreditCardIcon, MonetizationOn as MonetizationOnIcon } from "@mui/icons-material";
import { Box, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTotalNumberOfPurchases, fetchTotalSalesAmount } from "../../../redux/purchase/purchase.action";
import { getActiveCreditPackages } from "../../../redux/creditpackage/creditpackage.action";

const Overview = () => {
  const dispatch = useDispatch();

  const { totalSales, totalPurchases } = useSelector((state) => state.purchase);
  const { activeCreditPackages } = useSelector((state) => state.creditpackage);
  const metrics = [
    { title: "Total Purchases", icon: <BookIcon />, value: totalPurchases },
    { title: "Total Revenue", icon: <MonetizationOnIcon />, value: totalSales },
    { title: "Active Credit Packages", icon: <CreditCardIcon />, value: activeCreditPackages?.length },
  ];
  useEffect(() => {
    // Fetch all admin statistics on component mount
    dispatch(getActiveCreditPackages());
    dispatch(fetchTotalSalesAmount());
    dispatch(fetchTotalNumberOfPurchases());
  }, [dispatch]);
  return (
    <Grid container spacing={3}>
      {metrics?.map((metric) => (
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
