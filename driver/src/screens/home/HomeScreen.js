// src/screens/home/HomeScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import useLocation from "../../hooks/useLocation";
import { fetchAvailableRides } from "../../store/slices/availableRidesSlice";
import { acceptRide } from "../../store/slices/rideSlice";
import { setAvailability } from "../../store/slices/authSlice";
import {
  toggleRiderAvailability,
  acceptRideRequest,
  updateRiderLocation,
} from "../../services/socketService";

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { rider, isAvailable } = useSelector((state) => state.auth);
  const { rides, isLoading: ridesLoading } = useSelector(
    (state) => state.availableRides
  );
  const { currentRide } = useSelector((state) => state.ride);

  const [selectedRide, setSelectedRide] = useState(null);
  const [showRideModal, setShowRideModal] = useState(false);

  const { location, startLocationTracking, stopLocationTracking, isTracking } =
    useLocation((newLocation) => {
      // Callback for location updates
      if (rider && rider._id && isAvailable) {
        updateRiderLocation(rider._id, newLocation);
      }
    });

  const mapRef = useRef(null);

  useEffect(() => {
    // If rider already has an active ride, navigate to ride screen
    if (
      currentRide &&
      ["accepted", "in-progress"].includes(currentRide.status)
    ) {
      navigation.navigate("Ride", { screen: "ActiveRide" });
    }
  }, [currentRide, navigation]);

  useEffect(() => {
    // Fetch available rides when becoming available
    if (isAvailable) {
      dispatch(fetchAvailableRides());

      // Start location tracking
      startLocationTracking();
    } else if (isTracking) {
      // Stop location tracking when going offline
      stopLocationTracking();
    }
  }, [isAvailable, dispatch]);

  const toggleAvailability = () => {
    if (!rider || !rider._id) return;

    const newStatus = !isAvailable;

    // Update availability locally
    dispatch(setAvailability(newStatus));

    // Update availability on server via socket
    toggleRiderAvailability(rider._id, newStatus);

    if (newStatus) {
      // Start location tracking and fetch available rides
      startLocationTracking();
      dispatch(fetchAvailableRides());
    } else {
      // Stop location tracking
      stopLocationTracking();
    }
  };

  const handleAcceptRide = async () => {
    if (!selectedRide) return;

    try {
      // Accept the ride through API
      await dispatch(acceptRide(selectedRide._id)).unwrap();

      // Also emit via socket for real-time notification to user
      acceptRideRequest(selectedRide._id, rider._id);

      setShowRideModal(false);
      navigation.navigate("Ride", { screen: "ActiveRide" });
    } catch (error) {
      Alert.alert("Error", "Failed to accept ride. Please try again.");
    }
  };

  const handleRidePress = (ride) => {
    setSelectedRide(ride);
    setShowRideModal(true);
  };

  const renderRideItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rideItem}
      onPress={() => handleRidePress(item)}
    >
      <View style={styles.rideHeader}>
        <Text style={styles.rideDistance}>
          {calculateDistance(location, item.pickupLocation.coordinates).toFixed(
            1
          )}{" "}
          km away
        </Text>
        <Text style={styles.ridePrice}>${item.fare.total.toFixed(2)}</Text>
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
            {item.pickupLocation.address}
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
            {item.dropoffLocation.address}
          </Text>
        </View>
      </View>

      {item.preferredRiderGender !== "no_preference" && (
        <View style={styles.preferenceTag}>
          <MaterialIcons name='person' size={16} color='white' />
          <Text style={styles.preferenceText}>
            {item.preferredRiderGender.charAt(0).toUpperCase() +
              item.preferredRiderGender.slice(1)}{" "}
            driver requested
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Calculate distance between two points (simple version)
  const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return 0;

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(point2.latitude - point1.latitude);
    const dLon = deg2rad(point2.longitude - point1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(point1.latitude)) *
        Math.cos(deg2rad(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const filteredRides = rides.filter((ride) => {
    // If ride has gender preference, check if driver matches
    if (ride.preferredRiderGender !== "no_preference") {
      return ride.preferredRiderGender === rider.gender;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Driver location marker */}
          <Marker coordinate={location} title='Your Location'>
            <View style={styles.driverMarker}>
              <MaterialIcons name='directions-car' size={20} color='#007BFF' />
            </View>
          </Marker>

          {/* Available ride markers */}
          {isAvailable &&
            filteredRides.map((ride) => (
              <Marker
                key={ride._id}
                coordinate={ride.pickupLocation.coordinates}
                title='Pickup'
                pinColor='green'
                onPress={() => handleRidePress(ride)}
              />
            ))}
        </MapView>
      )}

      {/* Status bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusText}>
            You are currently {isAvailable ? "online" : "offline"}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isAvailable ? styles.onlineButton : styles.offlineButton,
          ]}
          onPress={toggleAvailability}
        >
          <Text style={styles.toggleButtonText}>
            {isAvailable ? "Go Offline" : "Go Online"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Available rides list */}
      {isAvailable && (
        <View style={styles.ridesContainer}>
          <Text style={styles.ridesTitle}>
            {filteredRides.length}
            {filteredRides.length === 1 ? " Ride" : " Rides"} Available
          </Text>

          {ridesLoading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading available rides...</Text>
            </View>
          ) : filteredRides.length === 0 ? (
            <View style={styles.noRidesContainer}>
              <MaterialIcons name='search' size={40} color='#999' />
              <Text style={styles.noRidesText}>No rides available</Text>
              <Text style={styles.noRidesSubtext}>
                Relax and wait for ride requests to appear here
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredRides}
              renderItem={renderRideItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ridesList}
            />
          )}
        </View>
      )}

      {/* Ride details modal */}
      <Modal
        visible={showRideModal}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setShowRideModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ride Request</Text>

            {selectedRide && (
              <ScrollView>
                <View style={styles.rideAddresses}>
                  <View style={styles.addressRow}>
                    <MaterialIcons
                      name='my-location'
                      size={20}
                      color='green'
                      style={styles.addressIcon}
                    />
                    <Text style={styles.addressText}>
                      {selectedRide.pickupLocation.address}
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
                    <Text style={styles.addressText}>
                      {selectedRide.dropoffLocation.address}
                    </Text>
                  </View>
                </View>

                <View style={styles.fareDetails}>
                  <Text style={styles.fareTitle}>Fare Details:</Text>
                  <View style={styles.fareRow}>
                    <Text>Base Fare:</Text>
                    <Text>${selectedRide.fare.baseFare.toFixed(2)}</Text>
                  </View>
                  <View style={styles.fareRow}>
                    <Text>Distance:</Text>
                    <Text>${selectedRide.fare.distance.toFixed(2)}</Text>
                  </View>
                  <View style={styles.fareRow}>
                    <Text>Duration:</Text>
                    <Text>${selectedRide.fare.duration.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.fareRow, styles.fareTotal]}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalText}>
                      ${selectedRide.fare.total.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {selectedRide.preferredRiderGender !== "no_preference" && (
                  <View style={styles.preferenceNote}>
                    <MaterialIcons name='info' size={20} color='#007BFF' />
                    <Text style={styles.preferenceNoteText}>
                      This user has requested a{" "}
                      {selectedRide.preferredRiderGender} driver
                    </Text>
                  </View>
                )}

                <View style={styles.distanceNote}>
                  <MaterialIcons name='directions-car' size={20} color='#333' />
                  <Text style={styles.distanceNoteText}>
                    Pickup is{" "}
                    {calculateDistance(
                      location,
                      selectedRide.pickupLocation.coordinates
                    ).toFixed(1)}{" "}
                    km away
                  </Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.declineButton]}
                onPress={() => setShowRideModal(false)}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.acceptButton]}
                onPress={handleAcceptRide}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
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
  map: {
    flex: 1,
  },
  driverMarker: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  statusBar: {
    position: "absolute",
    top: 45,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 15,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  onlineButton: {
    backgroundColor: "#28a745",
  },
  offlineButton: {
    backgroundColor: "#dc3545",
  },
  toggleButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  ridesContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
    paddingTop: 15,
  },
  ridesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  ridesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rideItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rideDistance: {
    fontSize: 14,
    color: "#333",
  },
  ridePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  rideAddresses: {
    marginBottom: 10,
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
  preferenceTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },
  preferenceText: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  noRidesContainer: {
    padding: 30,
    alignItems: "center",
  },
  noRidesText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  noRidesSubtext: {
    textAlign: "center",
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  fareDetails: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  fareTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  fareTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalText: {
    fontWeight: "bold",
  },
  preferenceNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f2ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  preferenceNoteText: {
    marginLeft: 10,
    flex: 1,
  },
  distanceNote: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginBottom: 15,
  },
  distanceNoteText: {
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  declineButton: {
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: "#007BFF",
    marginLeft: 10,
  },
  declineButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HomeScreen;
