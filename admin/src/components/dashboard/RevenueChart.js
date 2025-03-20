// src/components/dashboard/RevenueChart.js
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data }) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Revenue Overview
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Area
                type='monotone'
                dataKey='revenue'
                stroke='#8884d8'
                fill='#8884d8'
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
