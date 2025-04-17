// src/components/dashboard/StatCard.js
import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";

const StatCard = ({ title, value, icon, color = "primary", subtext }) => {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography
            variant='h6'
            component='div'
            color='text.secondary'
            sx={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              color: "white",
              width: 40,
              height: 40,
            }}
          >
            {icon}
          </Avatar>
        </Box>

        <Typography
          variant='h4'
          component='div'
          sx={{
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {value}
        </Typography>

        {subtext && (
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              fontSize: "0.75rem",
              mt: 1,
              display: "block",
            }}
          >
            {subtext}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
