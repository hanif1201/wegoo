// src/pages/NotFoundPage.js
import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 500,
          textAlign: "center",
        }}
      >
        <Typography
          variant='h1'
          color='primary'
          sx={{ fontSize: 120, lineHeight: 1 }}
        >
          404
        </Typography>
        <Typography variant='h5' sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant='body1' color='textSecondary' sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
