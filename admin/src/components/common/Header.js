// src/components/common/Header.js
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Avatar,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const Header = ({ title }) => {
  const { admin } = useSelector((state) => state.auth);

  return (
    <AppBar
      position='fixed'
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: "white",
        color: "text.primary",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar>
        <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton color='inherit'>
          <Badge badgeContent={4} color='primary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
            {admin && admin.name ? (
              admin.name.charAt(0).toUpperCase()
            ) : (
              <PersonIcon />
            )}
          </Avatar>
          <Typography variant='body2' sx={{ ml: 1 }}>
            {admin?.name || "Admin"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
