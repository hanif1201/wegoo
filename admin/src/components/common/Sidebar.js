// src/components/common/Sidebar.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DirectionsCar as RidersIcon,
  Map as RidesIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../store/slices/authSlice";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Users", icon: <PeopleIcon />, path: "/users" },
  { text: "Riders", icon: <RidersIcon />, path: "/riders" },
  { text: "Rides", icon: <RidesIcon />, path: "/rides" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/login");
  };

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1a237e",
          color: "white",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant='h6' component='div' sx={{ fontWeight: "bold" }}>
          Wegoo Admin
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname.startsWith(item.path)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "rgba(255, 255, 255, 0.16)",
              },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }} />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon sx={{ color: "white" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
