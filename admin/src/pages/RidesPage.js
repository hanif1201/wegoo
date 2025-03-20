// src/pages/RidesPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRides, fetchRideDetails } from "../store/slices/ridesSlice";
import Layout from "../components/common/Layout";

const RidesPage = () => {
  const dispatch = useDispatch();
  const { ridesList, isLoading } = useSelector((state) => state.rides);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(
      fetchRides({
        page: page + 1,
        limit: rowsPerPage,
        filters: {
          search: searchQuery,
          status: statusFilter,
        },
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleOpenRideDetails = (rideId) => {
    dispatch(fetchRideDetails(rideId)).then((result) => {
      if (result.payload && result.payload.data) {
        setSelectedRide(result.payload.data);
        setOpenDialog(true);
      }
    });
  };

  const getStatusChip = (status) => {
    let color = "default";
    switch (status) {
      case "completed":
        color = "success";
        break;
      case "in-progress":
        color = "info";
        break;
      case "accepted":
        color = "primary";
        break;
      case "requested":
        color = "warning";
        break;
      case "cancelled":
        color = "error";
        break;
      default:
        color = "default";
    }
    return <Chip label={status} color={color} size='small' />;
  };

  return (
    <Layout title='Rides Management'>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' gutterBottom>
          Rides Management
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          View and manage all rides on the platform
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              placeholder='Search rides...'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            <FormControl variant='outlined' size='small' sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label='Status'
              >
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='requested'>Requested</MenuItem>
                <MenuItem value='accepted'>Accepted</MenuItem>
                <MenuItem value='in-progress'>In Progress</MenuItem>
                <MenuItem value='completed'>Completed</MenuItem>
                <MenuItem value='cancelled'>Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button variant='contained' color='primary'>
            Export Data
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ride ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Rider</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Dropoff</TableCell>
                <TableCell>Fare</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ridesList.data.map((ride) => (
                <TableRow key={ride._id}>
                  <TableCell>{ride._id.substring(0, 8)}</TableCell>
                  <TableCell>{ride.userId?.name || "Unknown"}</TableCell>
                  <TableCell>{ride.riderId?.name || "Not Assigned"}</TableCell>
                  <TableCell>
                    {new Date(ride.requestTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {ride.pickupLocation.address.substring(0, 15)}...
                  </TableCell>
                  <TableCell>
                    {ride.dropoffLocation.address.substring(0, 15)}...
                  </TableCell>
                  <TableCell>${ride.fare.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusChip(ride.status)}</TableCell>
                  <TableCell>
                    <IconButton
                      size='small'
                      onClick={() => handleOpenRideDetails(ride._id)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={ridesList.totalRides}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Ride Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth='md'
        fullWidth
      >
        {selectedRide && (
          <>
            <DialogTitle>Ride Details</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Basic Information
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  <Box sx={{ flexBasis: "45%" }}>
                    <Typography variant='body1'>
                      <strong>Ride ID:</strong> {selectedRide._id}
                    </Typography>
                    <Typography variant='body1'>
                      <strong>Status:</strong> {selectedRide.status}
                    </Typography>
                    <Typography variant='body1'>
                      <strong>Request Time:</strong>{" "}
                      {new Date(selectedRide.requestTime).toLocaleString()}
                    </Typography>
                    {selectedRide.acceptTime && (
                      <Typography variant='body1'>
                        <strong>Accept Time:</strong>{" "}
                        {new Date(selectedRide.acceptTime).toLocaleString()}
                      </Typography>
                    )}
                    {selectedRide.pickupTime && (
                      <Typography variant='body1'>
                        <strong>Pickup Time:</strong>{" "}
                        {new Date(selectedRide.pickupTime).toLocaleString()}
                      </Typography>
                    )}
                    {selectedRide.dropoffTime && (
                      <Typography variant='body1'>
                        <strong>Dropoff Time:</strong>{" "}
                        {new Date(selectedRide.dropoffTime).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ flexBasis: "45%" }}>
                    <Typography variant='body1'>
                      <strong>User:</strong>{" "}
                      {selectedRide.userId?.name || "Unknown"}
                    </Typography>
                    <Typography variant='body1'>
                      <strong>User Email:</strong>{" "}
                      {selectedRide.userId?.email || "Unknown"}
                    </Typography>
                    <Typography variant='body1'>
                      <strong>Rider:</strong>{" "}
                      {selectedRide.riderId?.name || "Not Assigned"}
                    </Typography>
                    {selectedRide.riderId && (
                      <Typography variant='body1'>
                        <strong>Rider Email:</strong>{" "}
                        {selectedRide.riderId?.email || "Unknown"}
                      </Typography>
                    )}
                    <Typography variant='body1'>
                      <strong>Payment Method:</strong>{" "}
                      {selectedRide.paymentMethod}
                    </Typography>
                    <Typography variant='body1'>
                      <strong>Payment Status:</strong>{" "}
                      {selectedRide.paymentStatus}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Location Information
                </Typography>
                <Typography variant='body1'>
                  <strong>Pickup Address:</strong>{" "}
                  {selectedRide.pickupLocation.address}
                </Typography>
                <Typography variant='body1'>
                  <strong>Dropoff Address:</strong>{" "}
                  {selectedRide.dropoffLocation.address}
                </Typography>
                {selectedRide.route && (
                  <>
                    <Typography variant='body1'>
                      <strong>Distance:</strong>{" "}
                      {selectedRide.route.distance.toFixed(2)} km
                    </Typography>
                    <Typography variant='body1'>
                      <strong>Duration:</strong>{" "}
                      {selectedRide.route.duration.toFixed(0)} minutes
                    </Typography>
                  </>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Fare Details
                </Typography>
                <Typography variant='body1'>
                  <strong>Base Fare:</strong> $
                  {selectedRide.fare.baseFare.toFixed(2)}
                </Typography>
                <Typography variant='body1'>
                  <strong>Distance Cost:</strong> $
                  {selectedRide.fare.distance.toFixed(2)}
                </Typography>
                <Typography variant='body1'>
                  <strong>Duration Cost:</strong> $
                  {selectedRide.fare.duration.toFixed(2)}
                </Typography>
                <Typography variant='body1' sx={{ fontWeight: "bold" }}>
                  <strong>Total Fare:</strong> $
                  {selectedRide.fare.total.toFixed(2)}
                </Typography>
              </Box>

              {(selectedRide.userRating || selectedRide.riderRating) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Ratings and Feedback
                  </Typography>
                  {selectedRide.userRating && (
                    <Typography variant='body1'>
                      <strong>User Rating:</strong> {selectedRide.userRating} /
                      5
                      {selectedRide.userFeedback &&
                        ` - "${selectedRide.userFeedback}"`}
                    </Typography>
                  )}
                  {selectedRide.riderRating && (
                    <Typography variant='body1'>
                      <strong>Rider Rating:</strong> {selectedRide.riderRating}{" "}
                      / 5
                      {selectedRide.riderFeedback &&
                        ` - "${selectedRide.riderFeedback}"`}
                    </Typography>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

export default RidesPage;
