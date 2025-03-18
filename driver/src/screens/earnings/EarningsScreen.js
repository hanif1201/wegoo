// src/screens/earnings/EarningsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchEarnings } from "../../store/slices/earningsSlice";
import { fetchRideHistory } from "../../store/slices/rideSlice";

const EarningsScreen = () => {
  const dispatch = useDispatch();
  const { summary, transactions, isLoading } = useSelector(
    (state) => state.earnings
  );
  const { rideHistory } = useSelector((state) => state.ride);

  const [selectedPeriod, setSelectedPeriod] = useState("week");

  useEffect(() => {
    // Fetch earnings data when the component mounts
    dispatch(fetchEarnings(selectedPeriod));
    dispatch(fetchRideHistory());
  }, [dispatch, selectedPeriod]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const renderRideItem = ({ item }) => (
    <View style={styles.rideItem}>
      <View style={styles.rideHeader}>
        <Text style={styles.rideDate}>
          {new Date(item.requestTime).toLocaleDateString()}
        </Text>
        <Text style={styles.ridePrice}>${item.fare.total.toFixed(2)}</Text>
      </View>

      <View style={styles.rideAddresses}>
        <View style={styles.addressRow}>
          <MaterialIcons
            name='my-location'
            size={16}
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
            size={16}
            color='red'
            style={styles.addressIcon}
          />
          <Text style={styles.addressText} numberOfLines={1}>
            {item.dropoffLocation.address}
          </Text>
        </View>
      </View>

      <View style={styles.rideStatus}>
        <Text
          style={[
            styles.statusText,
            item.status === "completed"
              ? styles.completedStatus
              : styles.otherStatus,
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.earningsSummary}>
          <Text style={styles.summaryTitle}>
            {selectedPeriod === "week"
              ? "This Week"
              : selectedPeriod === "month"
              ? "This Month"
              : "All Time"}
          </Text>
          <Text style={styles.earningsAmount}>
            ${summary ? summary.total.toFixed(2) : "0.00"}
          </Text>

          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === "week" && styles.selectedPeriod,
              ]}
              onPress={() => handlePeriodChange("week")}
            >
              <Text
                style={
                  selectedPeriod === "week"
                    ? styles.selectedPeriodText
                    : styles.periodText
                }
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === "month" && styles.selectedPeriod,
              ]}
              onPress={() => handlePeriodChange("month")}
            >
              <Text
                style={
                  selectedPeriod === "month"
                    ? styles.selectedPeriodText
                    : styles.periodText
                }
              >
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === "all" && styles.selectedPeriod,
              ]}
              onPress={() => handlePeriodChange("all")}
            >
              <Text
                style={
                  selectedPeriod === "all"
                    ? styles.selectedPeriodText
                    : styles.periodText
                }
              >
                All Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {summary ? summary.totalRides : 0}
            </Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {summary ? summary.hours.toFixed(1) : 0}
            </Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ${summary ? summary.avgPerHour.toFixed(2) : "0.00"}
            </Text>
            <Text style={styles.statLabel}>Per Hour</Text>
          </View>
        </View>

        <View style={styles.ridesContainer}>
          <Text style={styles.sectionTitle}>Recent Rides</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading earnings data...</Text>
            </View>
          ) : rideHistory.length === 0 ? (
            <View style={styles.noRidesContainer}>
              <MaterialIcons name='history' size={40} color='#999' />
              <Text style={styles.noRidesText}>No rides yet</Text>
              <Text style={styles.noRidesSubtext}>
                Your completed rides will appear here
              </Text>
            </View>
          ) : (
            <FlatList
              data={rideHistory}
              renderItem={renderRideItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#007BFF",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  earningsSummary: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  summaryTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  periodOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  selectedPeriod: {
    backgroundColor: "#007BFF",
  },
  periodText: {
    color: "#333",
  },
  selectedPeriodText: {
    color: "white",
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  ridesContainer: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  rideItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rideDate: {
    color: "#666",
  },
  ridePrice: {
    fontWeight: "bold",
  },
  rideAddresses: {
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  addressIcon: {
    marginRight: 5,
  },
  addressText: {
    fontSize: 12,
    color: "#333",
  },
  addressDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginLeft: 20,
    marginVertical: 3,
  },
  rideStatus: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  completedStatus: {
    color: "green",
  },
  otherStatus: {
    color: "#666",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  noRidesContainer: {
    padding: 20,
    alignItems: "center",
  },
  noRidesText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  noRidesSubtext: {
    textAlign: "center",
    color: "#666",
  },
});

export default EarningsScreen;
