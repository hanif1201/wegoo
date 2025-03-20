// src/components/dashboard/ActivityFeed.js
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import {
  DirectionsCar as RideIcon,
  Person as UserIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import moment from "moment";

const ActivityFeed = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case "ride":
        return <RideIcon />;
      case "user":
        return <UserIcon />;
      case "payment":
        return <PaymentIcon />;
      default:
        return <UserIcon />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "ride":
        return "primary.main";
      case "user":
        return "success.main";
      case "payment":
        return "warning.main";
      default:
        return "primary.main";
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Recent Activity
        </Typography>
        <List sx={{ width: "100%", maxHeight: 380, overflow: "auto" }}>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getColor(activity.type) }}>
                    {getIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component='span'
                        variant='body2'
                        color='text.primary'
                      >
                        {activity.description}
                      </Typography>
                      <Typography
                        variant='caption'
                        display='block'
                        color='text.secondary'
                      >
                        {moment(activity.timestamp).fromNow()}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && (
                <Divider variant='inset' component='li' />
              )}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
