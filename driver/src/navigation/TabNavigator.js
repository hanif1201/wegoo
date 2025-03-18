// src/navigation/TabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/home/HomeScreen";
import RideHistoryScreen from "../screens/ride/RideHistoryScreen";
import EarningsScreen from "../screens/earnings/EarningsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "History") {
            iconName = "history";
          } else if (route.name === "Earnings") {
            iconName = "attach-money";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
      tabBarOptions={{
        activeTintColor: "#007BFF",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='History' component={RideHistoryScreen} />
      <Tab.Screen name='Earnings' component={EarningsScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
