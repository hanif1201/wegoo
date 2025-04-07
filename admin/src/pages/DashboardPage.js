// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
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

  // Directly extract the values from Redux state with better defaults
  const userStats = useSelector((state) => state.users?.stats || {});
  const rideStats = useSelector((state) => state.rides?.stats || {});

  // Add a loading state to handle initial render
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to true when fetching starts
    setIsLoading(true);
    console.log("Fetching stats...");

    // Use Promise.all to wait for both API calls
    Promise.all([dispatch(fetchUserStats()), dispatch(fetchRideStats("week"))])
      .then(() => {
        setIsLoading(false);
        console.log("Stats fetched successfully");
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setIsLoading(false);
      });
  }, [dispatch]);

  // More detailed logging to debug the state
  console.log("User Stats from Redux:", userStats);
  console.log("Ride Stats from Redux:", rideStats);
  console.log("Loading State:", isLoading);

  // Safely access values with defaults
  const totalUsers = userStats?.totalUsers || 0;
  const totalRiders = userStats?.totalRiders || 0;
  const totalRides = userStats?.totalRides || 0;
  const totalRevenue = userStats?.totalRevenue || 0;
  const avgDistance = rideStats?.avgDistance || 0;
  const avgDuration = rideStats?.avgDuration || 0;
  const avgFare = rideStats?.avgFare || 0;
  const retentionRate = userStats?.retentionRate || 0;

  return (
    <Layout title='Dashboard'>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' gutterBottom>
          Welcome to WeGoo Admin
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Here's what's happening with your platform today
        </Typography>
        {isLoading && (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            Loading dashboard data...
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Users'
            value={totalUsers}
            icon={<PeopleIcon />}
            color='primary'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Riders'
            value={totalRiders}
            icon={<RidersIcon />}
            color='success'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Rides'
            value={totalRides}
            icon={<RidesIcon />}
            color='info'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Revenue'
            value={`$${totalRevenue.toFixed(2)}`}
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
                    {avgDistance.toFixed(2)} km
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Average Ride Duration
                  </Typography>
                  <Typography variant='h6'>
                    {avgDuration.toFixed(0)} min
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Average Fare
                  </Typography>
                  <Typography variant='h6'>${avgFare.toFixed(2)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    User Retention Rate
                  </Typography>
                  <Typography variant='h6'>
                    {retentionRate.toFixed(1)}%
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
