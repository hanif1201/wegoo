// src/pages/RidersPage.js
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
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRiders,
  updateRiderStatus,
  fetchRiderDetails,
} from "../store/slices/ridersSlice";
import Layout from "../components/common/Layout";

const RidersPage = () => {
  const dispatch = useDispatch();
  const { ridersList, isLoading } = useSelector((state) => state.riders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(
      fetchRiders({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

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

  const handleOpenRiderDetails = (riderId) => {
    dispatch(fetchRiderDetails(riderId)).then((result) => {
      if (result.payload && result.payload.data) {
        setSelectedRider(result.payload.data);
        setOpenDialog(true);
      }
    });
  };

  const handleStatusChange = (riderId, newStatus) => {
    dispatch(updateRiderStatus({ riderId, status: newStatus }));
    setOpenDialog(false);
  };

  const getStatusChip = (status) => {
    let color = "default";
    switch (status) {
      case "approved":
        color = "success";
        break;
      case "pending":
        color = "warning";
        break;
      case "rejected":
      case "blocked":
        color = "error";
        break;
      default:
        color = "default";
    }
    return <Chip label={status} color={color} size='small' />;
  };

  return (
    <Layout title='Riders Management'>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' gutterBottom>
          Riders Management
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          View and manage all riders on the platform
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            placeholder='Search riders...'
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
          <Button variant='contained' color='primary'>
            Export Data
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rider ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ridersList.data.map((rider) => (
                <TableRow key={rider._id}>
                  <TableCell>{rider._id.substring(0, 8)}</TableCell>
                  <TableCell>{rider.name}</TableCell>
                  <TableCell>{rider.email}</TableCell>
                  <TableCell>{rider.phone}</TableCell>
                  <TableCell>{`${rider.vehicleDetails?.color} ${rider.vehicleDetails?.model}`}</TableCell>
                  <TableCell>{rider.gender || "Not specified"}</TableCell>
                  <TableCell>
                    {getStatusChip(rider.verificationStatus || "pending")}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size='small'
                      onClick={() => handleOpenRiderDetails(rider._id)}
                    >
                      <MoreVertIcon />
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
          count={ridersList.totalRiders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Rider Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        {selectedRider && (
          <>
            <DialogTitle>Rider Details</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Basic Information
                </Typography>
                <Typography variant='body1'>
                  <strong>Name:</strong> {selectedRider.name}
                </Typography>
                <Typography variant='body1'>
                  <strong>Email:</strong> {selectedRider.email}
                </Typography>
                <Typography variant='body1'>
                  <strong>Phone:</strong> {selectedRider.phone}
                </Typography>
                <Typography variant='body1'>
                  <strong>Gender:</strong>{" "}
                  {selectedRider.gender || "Not specified"}
                </Typography>
                <Typography variant='body1'>
                  <strong>Joined:</strong>{" "}
                  {new Date(selectedRider.createdAt).toLocaleString()}
                </Typography>
                <Typography variant='body1'>
                  <strong>Status:</strong>{" "}
                  {selectedRider.verificationStatus || "pending"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Vehicle Information
                </Typography>
                <Typography variant='body1'>
                  <strong>Type:</strong> {selectedRider.vehicleDetails?.type}
                </Typography>
                <Typography variant='body1'>
                  <strong>Model:</strong> {selectedRider.vehicleDetails?.model}
                </Typography>
                <Typography variant='body1'>
                  <strong>Color:</strong> {selectedRider.vehicleDetails?.color}
                </Typography>
                <Typography variant='body1'>
                  <strong>License Plate:</strong>{" "}
                  {selectedRider.vehicleDetails?.licensePlate}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Performance
                </Typography>
                <Typography variant='body1'>
                  <strong>Total Rides:</strong> {selectedRider.totalRides || 0}
                </Typography>
                <Typography variant='body1'>
                  <strong>Completion Rate:</strong>{" "}
                  {(selectedRider.completionRate || 0).toFixed(1)}%
                </Typography>
                <Typography variant='body1'>
                  <strong>Total Earnings:</strong> $
                  {(selectedRider.totalEarnings || 0).toFixed(2)}
                </Typography>
                <Typography variant='body1'>
                  <strong>Average Rating:</strong>{" "}
                  {(selectedRider.averageRating || 0).toFixed(1)} / 5
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              {selectedRider.verificationStatus !== "blocked" && (
                <Button
                  startIcon={<BlockIcon />}
                  color='error'
                  onClick={() =>
                    handleStatusChange(selectedRider._id, "blocked")
                  }
                >
                  Block Rider
                </Button>
              )}
              {selectedRider.verificationStatus === "pending" && (
                <Button
                  startIcon={<CheckIcon />}
                  color='success'
                  onClick={() =>
                    handleStatusChange(selectedRider._id, "approved")
                  }
                >
                  Approve Rider
                </Button>
              )}
              {selectedRider.verificationStatus === "blocked" && (
                <Button
                  startIcon={<CheckIcon />}
                  color='success'
                  onClick={() =>
                    handleStatusChange(selectedRider._id, "approved")
                  }
                >
                  Unblock Rider
                </Button>
              )}
              <Button startIcon={<EditIcon />} color='primary'>
                Edit Details
              </Button>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

export default RidersPage;
