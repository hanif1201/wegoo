// src/pages/DashboardPage.js
import React, { useEffect, useMemo } from "react";
import { Grid, Typography, Box, Paper, CircularProgress } from "@mui/material";
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

  // Using memoized selectors to prevent unnecessary re-renders
  const userStats = useSelector((state) => state.users.stats);
  const rideStats = useSelector((state) => state.rides.stats);
  const userLoading = useSelector((state) => state.users.isLoading);
  const rideLoading = useSelector((state) => state.rides.isLoading);

  // Derive loading state from both slices
  const isLoading = useMemo(
    () => userLoading || rideLoading,
    [userLoading, rideLoading]
  );

  useEffect(() => {
    const fetchStats = async () => {
      console.log("Fetching stats...");
      try {
        // Fetch user stats first
        await dispatch(fetchUserStats()).unwrap();

        // Try to fetch ride stats, but don't let it block if it fails
        try {
          await dispatch(fetchRideStats("week")).unwrap();
          console.log("All stats fetched successfully");
        } catch (rideError) {
          console.error("Error fetching ride stats:", rideError);
          // Set fallback ride stats
          dispatch({
            type: "rides/fetchStats/fulfilled",
            payload: {
              data: {
                total: 0,
                completed: 0,
                cancelled: 0,
                active: 0,
                revenue: 0,
                avgDistance: 0,
                avgDuration: 0,
                avgFare: 0,
              },
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchStats();

    // Set up refresh interval for real-time updates
    const interval = setInterval(fetchStats, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  // For debugging
  useEffect(() => {
    if (userStats) {
      console.log("User Stats from Redux:", userStats);
    }
    if (rideStats) {
      console.log("Ride Stats from Redux:", rideStats);
      console.log(
        "Detailed Ride Stats Structure:",
        JSON.stringify(rideStats, null, 2)
      );
    }
    console.log("Loading State:", isLoading);
  }, [userStats, rideStats, isLoading]);

  // Safely access values with defaults - handle nested data structure
  const totalUsers = userStats?.data?.totalUsers || 0;
  const activeUsers = userStats?.data?.activeUsers || 0;
  const inactiveUsers = totalUsers - activeUsers;

  // Try multiple possible data paths for ride stats
  const totalRides = rideStats?.data?.totalRides || rideStats?.data?.total || 0;
  const completedRides = rideStats?.data?.completed || 0;
  const cancelledRides = rideStats?.data?.cancelled || 0;
  const activeRides = rideStats?.data?.active || 0;

  // Derived metrics with safety checks
  const totalRevenue =
    rideStats?.data?.totalEarnings || rideStats?.data?.revenue || 0;
  const avgDistance = rideStats?.data?.totalDistance
    ? rideStats.data.totalDistance / totalRides
    : 0;
  const avgDuration = rideStats?.data?.avgDuration || 0;
  const avgFare = totalRides > 0 ? totalRevenue / totalRides : 0;

  // Calculate retention rate if data is available
  const retentionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

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

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
          <Typography variant='body1' sx={{ ml: 2 }}>
            Loading dashboard data...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title='Total Users'
              value={totalUsers}
              icon={<PeopleIcon />}
              color='primary'
              subtext={`${activeUsers} active, ${inactiveUsers} inactive`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title='Total Rides'
              value={totalRides}
              icon={<RidesIcon />}
              color='success'
              subtext={`${completedRides} completed, ${activeRides} active`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title='Ride Completion Rate'
              value={`${
                totalRides > 0
                  ? ((completedRides / totalRides) * 100).toFixed(1)
                  : 0
              }%`}
              icon={<RidersIcon />}
              color='info'
              subtext={`${cancelledRides} cancelled rides`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title='Total Revenue'
              value={`$${totalRevenue.toFixed(2)}`}
              icon={<RevenueIcon />}
              color='warning'
              subtext={`Avg $${avgFare.toFixed(2)} per ride`}
            />
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant='h6' gutterBottom>
                Revenue Trends
              </Typography>
              <RevenueChart data={revenueData} />
            </Paper>
          </Grid>

          {/* Activity Feed */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant='h6' gutterBottom>
                Recent Activity
              </Typography>
              <ActivityFeed activities={activities} />
            </Paper>
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
      )}
    </Layout>
  );
};

export default DashboardPage;
