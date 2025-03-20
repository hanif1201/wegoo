// src/pages/DashboardPage.js
import React, { useEffect } from "react";
import { Grid, Typography, Box, Paper } from "@mui/material";
import {
  People as PeopleIcon,
  DirectionsCar as RidersIcon,
  Map as RidesIcon,
  AttachMoney as RevenueIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/common/Layout";
import StatCard from "../components/dashboard/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { fetchUserStats } from "../store/slices/usersSlice";
import { fetchRideStats } from "../store/slices/ridesSlice";

// Sample data - in a real app this would come from your API
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
];

const activities = [
  {
    type: "user",
    title: "New User Registration",
    description: "John Doe registered as a new user",
    timestamp: new Date() - 1000 * 60 * 30,
  },
  {
    type: "ride",
    title: "Ride Completed",
    description: "Ride #1234 was completed successfully",
    timestamp: new Date() - 1000 * 60 * 60,
  },
  {
    type: "payment",
    title: "Payment Received",
    description: "$25.50 payment for ride #1234",
    timestamp: new Date() - 1000 * 60 * 90,
  },
  // Add more activities as needed
];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats: userStats } = useSelector((state) => state.users || {});
  const { stats: rideStats } = useSelector((state) => state.rides || {});

  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchRideStats("week"));
  }, [dispatch]);

  return (
    <Layout title='Dashboard'>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' gutterBottom>
          Welcome to Rider App Admin
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Here's what's happening with your platform today
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Users'
            value={userStats?.totalUsers || 0}
            icon={<PeopleIcon />}
            color='primary'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Riders'
            value={userStats?.totalRiders || 0}
            icon={<RidersIcon />}
            color='success'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Rides'
            value={rideStats?.totalRides || 0}
            icon={<RidesIcon />}
            color='info'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Revenue'
            value={`$${rideStats?.totalRevenue?.toFixed(2) || "0.00"}`}
            icon={<RevenueIcon />}
            color='warning'
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <RevenueChart data={revenueData} />
        </Grid>

        {/* Activity Feed */}
        <Grid item xs={12} md={4}>
          <ActivityFeed activities={activities} />
        </Grid>

        {/* Additional Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Key Performance Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Average Ride Distance
                  </Typography>
                  <Typography variant='h6'>
                    {rideStats?.avgDistance?.toFixed(2) || "0"} km
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Average Ride Duration
                  </Typography>
                  <Typography variant='h6'>
                    {rideStats?.avgDuration?.toFixed(0) || "0"} min
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Average Fare
                  </Typography>
                  <Typography variant='h6'>
                    ${rideStats?.avgFare?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    User Retention Rate
                  </Typography>
                  <Typography variant='h6'>
                    {userStats?.retentionRate?.toFixed(1) || "0"}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default DashboardPage;
