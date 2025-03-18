// src/screens/ride/ActiveRideScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import useLocation from "../../hooks/useLocation";
import {
  updateRideStatus,
  clearCurrentRide,
} from "../../store/slices/rideSlice";
import {
  updateRiderLocation,
  updateRideStatusSocket,
} from "../../services/socketService";

const ActiveRideScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { currentRide, isLoading } = useSelector((state) => state.ride);
  const { rider } = useSelector((state) => state.auth);

  const [showStatusModal, setShowStatusModal] = useState(false);

  const mapRef = useRef(null);
  const { location, startLocationTracking, stopLocationTracking } = useLocation(
    (newLocation) => {
      // Callback for location updates
      if (rider && rider._id && currentRide) {
        updateRiderLocation(rider._id, newLocation);
      }
    }
  );

  useEffect(() => {
    // Start tracking location for real-time updates
    startLocationTracking();

    return () => {
      // Clean up location tracking when component unmounts
      stopLocationTracking();
    };
  }, []);

  useEffect(() => {
    if (!currentRide) {
      // If no current ride, go back to home
      navigation.navigate("Main", { screen: "Home" });
      return;
    }

    // Fit map to show pickup, dropoff, and driver location
    if (mapRef.current && currentRide) {
      const coordinates = [
        currentRide.pickupLocation.coordinates,
        currentRide.dropoffLocation.coordinates,
      ];

      if (location) {
        coordinates.push(location);
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 150, left: 50 },
        animated: true,
      });
    }

    // Check if ride is completed
    if (currentRide.status === "completed") {
      // Navigate to rate screen
      setTimeout(() => {
        navigation.navigate("Ride", {
          screen: "RateUser",
          params: { rideId: currentRide._id },
        });
      }, 1500);
    }
  }, [currentRide, location, navigation]);

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(
        updateRideStatus({
          rideId: currentRide._id,
          status: newStatus,
        })
      ).unwrap();

      // Also notify via socket
      updateRideStatusSocket(currentRide._id, newStatus, location);

      setShowStatusModal(false);

      if (newStatus === "completed") {
        // Will navigate to rating screen through useEffect
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update ride status. Please try again.");
    }
  };

  const getStatusOptions = () => {
    if (currentRide.status === "accepted") {
      return [
        { value: "in-progress", label: "Start Ride", icon: "play-arrow" },
        { value: "cancelled", label: "Cancel Ride", icon: "cancel" },
      ];
    } else if (currentRide.status === "in-progress") {
      return [
        { value: "completed", label: "Complete Ride", icon: "check-circle" },
        { value: "cancelled", label: "Cancel Ride", icon: "cancel" },
      ];
    }
    return [];
  };

  const getRideStatusText = () => {
    switch (currentRide?.status) {
      case "accepted":
        return "Picking up passenger";
      case "in-progress":
        return "Ride in progress";
      case "completed":
        return "Ride completed";
      case "cancelled":
        return "Ride cancelled";
      default:
        return "Unknown status";
    }
  };

  if (!currentRide) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No active ride</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentRide.pickupLocation.coordinates.latitude,
          longitude: currentRide.pickupLocation.coordinates.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Driver current location */}
        {location && (
          <Marker coordinate={location} title='Your Location'>
            <View style={styles.driverMarker}>
              <MaterialIcons name='directions-car' size={24} color='#007BFF' />
            </View>
          </Marker>
        )}

        {/* Pickup marker - only show if not picked up yet */}
        {currentRide.status === "accepted" && (
          <Marker
            coordinate={currentRide.pickupLocation.coordinates}
            title='Pickup'
            pinColor='green'
          >
            <View style={styles.pickupMarker}>
              <MaterialIcons name='person-pin-circle' size={30} color='green' />
            </View>
          </Marker>
        )}

        {/* Dropoff marker */}
        <Marker
          coordinate={currentRide.dropoffLocation.coordinates}
          title='Dropoff'
          pinColor='red'
        >
          <View style={styles.dropoffMarker}>
            <MaterialIcons name='location-on' size={30} color='red' />
          </View>
        </Marker>

        {/* Simplified route line - in real app you'd use directions API */}
        {location && (
          <Polyline
            coordinates={[
              location,
              currentRide.status === "accepted"
                ? currentRide.pickupLocation.coordinates
                : currentRide.dropoffLocation.coordinates,
            ]}
            strokeWidth={4}
            strokeColor='#007BFF'
          />
        )}
      </MapView>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{getRideStatusText()}</Text>
      </View>

      <View style={styles.rideInfoContainer}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <MaterialIcons name='person' size={40} color='#333' />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {currentRide.userId?.name || "Passenger"}
            </Text>
            <Text style={styles.ridePrice}>
              ${currentRide.fare.total.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <MaterialIcons name='phone' size={24} color='#007BFF' />
          </TouchableOpacity>
        </View>

        <View style={styles.rideAddresses}>
          <View style={styles.addressRow}>
            <MaterialIcons
              name='my-location'
              size={20}
              color='green'
              style={styles.addressIcon}
            />
            <Text style={styles.addressText} numberOfLines={1}>
              {currentRide.pickupLocation.address}
            </Text>
          </View>
          <View style={styles.addressDivider} />
          <View style={styles.addressRow}>
            <MaterialIcons
              name='location-on'
              size={20}
              color='red'
              style={styles.addressIcon}
            />
            <Text style={styles.addressText} numberOfLines={1}>
              {currentRide.dropoffLocation.address}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.updateStatusButton}
          onPress={() => setShowStatusModal(true)}
          disabled={isLoading}
        >
          <Text style={styles.updateStatusButtonText}>
            {isLoading ? "Updating..." : "Update Ride Status"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showStatusModal}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Ride Status</Text>

            {getStatusOptions().map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  option.value === "cancelled" && styles.cancelOption,
                ]}
                onPress={() => handleStatusChange(option.value)}
              >
                <MaterialIcons
                  name={option.icon}
                  size={24}
                  color={option.value === "cancelled" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.statusOptionText,
                    option.value === "cancelled" && styles.cancelOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  driverMarker: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  pickupMarker: {
    alignItems: "center",
  },
  dropoffMarker: {
    alignItems: "center",
  },
  statusBar: {
    position: "absolute",
    top: 45,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rideInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ridePrice: {
    fontSize: 16,
    color: "#007BFF",
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  rideAddresses: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  addressIcon: {
    marginRight: 10,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
  },
  addressDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginLeft: 30,
    marginVertical: 5,
  },
  updateStatusButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  updateStatusButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cancelOption: {
    backgroundColor: "#dc3545",
  },
  statusOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  cancelOptionText: {
    color: "white",
  },
  closeModalButton: {
    padding: 15,
    alignItems: "center",
  },
  closeModalButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
});

export default ActiveRideScreen;
