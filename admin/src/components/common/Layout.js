// src/components/common/Layout.js
import React from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

const drawerWidth = 240;

const Layout = ({ children, title }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Header title={title} />
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
