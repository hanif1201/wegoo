// src/hooks/useLocation.js
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Platform, Alert } from "react-native";

const LOCATION_TRACKING = "location-tracking";

// Define the background task
TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.error("Error in location tracking task:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];

    // You can send this to your server or store it locally
    if (location) {
      console.log("Location from background:", location.coords);
      // Here you would typically send this to your server
    }
  }
});

export const useLocation = (callback) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const watchId = useRef(null);

  const requestLocationPermission = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== "granted") {
      setError("Permission to access location was denied");
      return false;
    }

    if (Platform.OS === "android") {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        Alert.alert(
          "Background Location Access",
          "To provide the best driver experience, please allow the app to access your location in the background.",
          [{ text: "OK" }]
        );
      }
    }

    return true;
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setLocation(newLocation);
      if (callback) callback(newLocation);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const startLocationTracking = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      return;
    }

    // Begin tracking location
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 10, // minimum distance (meters) between updates
      timeInterval: 5000, // minimum time (ms) between updates
      foregroundService: {
        notificationTitle: "Rider App is tracking your location",
        notificationBody: "This is required for users to see your location",
      },
    });

    // Also watch for real-time location updates in the foreground
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
        timeInterval: 5000,
      },
      (location) => {
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setLocation(newLocation);
        if (callback) callback(newLocation);
      }
    );

    watchId.current = subscription;
    setIsTracking(true);
  };

  const stopLocationTracking = async () => {
    if (watchId.current) {
      watchId.current.remove();
      watchId.current = null;
    }

    const isTracking = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    if (isTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }

    setIsTracking(false);
  };

  // Get location on initial load
  useEffect(() => {
    getCurrentLocation();

    // Cleanup
    return () => {
      if (watchId.current) {
        watchId.current.remove();
      }
    };
  }, []);

  return {
    location,
    error,
    loading,
    isTracking,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
  };
};

export default useLocation;
