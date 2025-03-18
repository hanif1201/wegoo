// src/navigation/AppNavigator.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchCurrentRider } from "../store/slices/authSlice";
import { initSocket, closeSocket } from "../services/socketService";

import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";
import RideNavigator from "./RideNavigator";
import SplashScreen from "../screens/SplashScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, rider } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if rider is already logged in
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          // Fetch current rider if token exists
          await dispatch(fetchCurrentRider());

          // Initialize socket connection
          if (rider && rider._id) {
            initSocket(rider._id, token);
          }
        }
      } catch (e) {
        console.error("Error restoring token or fetching rider:", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();

    // Cleanup socket on unmount
    return () => {
      closeSocket();
    };
  }, [dispatch, rider]);

  // Initialize socket when rider authenticates
  useEffect(() => {
    const setupSocket = async () => {
      if (isAuthenticated && rider && rider._id) {
        const token = await AsyncStorage.getItem("token");
        initSocket(rider._id, token);
      }
    };

    setupSocket();
  }, [isAuthenticated, rider]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name='Auth' component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name='Main' component={TabNavigator} />
            <Stack.Screen name='Ride' component={RideNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
