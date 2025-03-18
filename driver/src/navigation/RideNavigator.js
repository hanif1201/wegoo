// src/navigation/RideNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ActiveRideScreen from "../screens/ride/ActiveRideScreen";
import RideDetailsScreen from "../screens/ride/RideDetailsScreen";
import RateUserScreen from "../screens/ride/RateUserScreen";

const Stack = createStackNavigator();

const RideNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='ActiveRide' component={ActiveRideScreen} />
      <Stack.Screen name='RideDetails' component={RideDetailsScreen} />
      <Stack.Screen name='RateUser' component={RateUserScreen} />
    </Stack.Navigator>
  );
};

export default RideNavigator;
