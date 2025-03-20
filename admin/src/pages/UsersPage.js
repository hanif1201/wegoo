// src/pages/UsersPage.js
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
  fetchUsers,
  updateUserStatus,
  fetchUserDetails,
} from "../store/slices/usersSlice";
import Layout from "../components/common/Layout";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { usersList } = useSelector((state) => state.users);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(
      fetchUsers({
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

  const handleOpenUserDetails = (userId) => {
    dispatch(fetchUserDetails(userId)).then((result) => {
      if (result.payload && result.payload.data) {
        setSelectedUser(result.payload.data);
        setOpenDialog(true);
      }
    });
  };

  const handleStatusChange = (userId, newStatus) => {
    dispatch(updateUserStatus({ userId, status: newStatus }));
    setOpenDialog(false);
  };

  const getStatusChip = (status) => {
    let color = "default";
    switch (status) {
      case "active":
        color = "success";
        break;
      case "inactive":
        color = "warning";
        break;
      case "blocked":
        color = "error";
        break;
      default:
        color = "default";
    }
    return <Chip label={status} color={color} size='small' />;
  };

  return (
    <Layout title='Users Management'>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' gutterBottom>
          Users Management
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          View and manage all users on the platform
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            placeholder='Search users...'
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
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Joined Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersList.data.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id.substring(0, 8)}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(user.status || "active")}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size='small'
                      onClick={() => handleOpenUserDetails(user._id)}
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
          count={usersList.totalUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* User Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>User Details</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Basic Information
                </Typography>
                <Typography variant='body1'>
                  <strong>Name:</strong> {selectedUser.name}
                </Typography>
                <Typography variant='body1'>
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
                <Typography variant='body1'>
                  <strong>Phone:</strong> {selectedUser.phone}
                </Typography>
                <Typography variant='body1'>
                  <strong>Joined:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </Typography>
                <Typography variant='body1'>
                  <strong>Status:</strong> {selectedUser.status || "active"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Ride Statistics
                </Typography>
                <Typography variant='body1'>
                  <strong>Total Rides:</strong> {selectedUser.totalRides || 0}
                </Typography>
                <Typography variant='body1'>
                  <strong>Total Spent:</strong> $
                  {selectedUser.totalSpent?.toFixed(2) || "0.00"}
                </Typography>
                <Typography variant='body1'>
                  <strong>Average Rating:</strong>{" "}
                  {selectedUser.rating?.toFixed(1) || "0.0"} / 5
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              {selectedUser.status !== "blocked" && (
                <Button
                  startIcon={<BlockIcon />}
                  color='error'
                  onClick={() =>
                    handleStatusChange(selectedUser._id, "blocked")
                  }
                >
                  Block User
                </Button>
              )}
              {selectedUser.status === "blocked" && (
                <Button
                  startIcon={<CheckIcon />}
                  color='success'
                  onClick={() => handleStatusChange(selectedUser._id, "active")}
                >
                  Activate User
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

export default UsersPage;
