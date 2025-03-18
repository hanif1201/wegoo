// src/screens/auth/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { registerRider, clearError } from "../../store/slices/authSlice";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("not_specified");
  const [vehicleType, setVehicleType] = useState("car");
  const [vehicleModel, setVehicleModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleRegister = async () => {
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !vehicleModel ||
      !licensePlate ||
      !vehicleColor
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const riderData = {
      name,
      email,
      phone,
      password,
      gender,
      vehicleDetails: {
        type: vehicleType,
        model: vehicleModel,
        licensePlate,
        color: vehicleColor,
      },
    };

    try {
      await dispatch(registerRider(riderData)).unwrap();
      navigation.navigate("DocumentsUpload");
    } catch (error) {
      // Error will be handled by the Redux state
    }
  };

  if (error) {
    Alert.alert("Registration Error", error, [
      {
        text: "OK",
        onPress: () => dispatch(clearError()),
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Become a Driver</Text>
      <Text style={styles.subtitle}>Sign up to start earning</Text>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <TextInput
          style={styles.input}
          placeholder='Full Name'
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <TextInput
          style={styles.input}
          placeholder='Phone Number'
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "male" && styles.selectedGender,
            ]}
            onPress={() => setGender("male")}
          >
            <Text
              style={
                gender === "male" ? styles.selectedText : styles.genderText
              }
            >
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "female" && styles.selectedGender,
            ]}
            onPress={() => setGender("female")}
          >
            <Text
              style={
                gender === "female" ? styles.selectedText : styles.genderText
              }
            >
              Female
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "other" && styles.selectedGender,
            ]}
            onPress={() => setGender("other")}
          >
            <Text
              style={
                gender === "other" ? styles.selectedText : styles.genderText
              }
            >
              Other
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Vehicle Information</Text>

        <Text style={styles.label}>Vehicle Type</Text>
        <View style={styles.vehicleTypeContainer}>
          <TouchableOpacity
            style={[
              styles.vehicleOption,
              vehicleType === "car" && styles.selectedVehicle,
            ]}
            onPress={() => setVehicleType("car")}
          >
            <MaterialIcons
              name='directions-car'
              size={24}
              color={vehicleType === "car" ? "white" : "#666"}
            />
            <Text
              style={
                vehicleType === "car" ? styles.selectedText : styles.vehicleText
              }
            >
              Car
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.vehicleOption,
              vehicleType === "motorcycle" && styles.selectedVehicle,
            ]}
            onPress={() => setVehicleType("motorcycle")}
          >
            <MaterialIcons
              name='motorcycle'
              size={24}
              color={vehicleType === "motorcycle" ? "white" : "#666"}
            />
            <Text
              style={
                vehicleType === "motorcycle"
                  ? styles.selectedText
                  : styles.vehicleText
              }
            >
              Motorcycle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.vehicleOption,
              vehicleType === "bike" && styles.selectedVehicle,
            ]}
            onPress={() => setVehicleType("bike")}
          >
            <MaterialIcons
              name='directions-bike'
              size={24}
              color={vehicleType === "bike" ? "white" : "#666"}
            />
            <Text
              style={
                vehicleType === "bike"
                  ? styles.selectedText
                  : styles.vehicleText
              }
            >
              Bike
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder='Vehicle Model (e.g., Toyota Camry)'
          value={vehicleModel}
          onChangeText={setVehicleModel}
        />

        <TextInput
          style={styles.input}
          placeholder='License Plate'
          value={licensePlate}
          onChangeText={setLicensePlate}
          autoCapitalize='characters'
        />

        <TextInput
          style={styles.input}
          placeholder='Vehicle Color'
          value={vehicleColor}
          onChangeText={setVehicleColor}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderOption: {
    flex: 1,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedGender: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  genderText: {
    color: "#666",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
  vehicleTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  vehicleOption: {
    flex: 1,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 5,
    padding: 10,
  },
  selectedVehicle: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  vehicleText: {
    color: "#666",
    marginTop: 5,
  },
  button: {
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  footerText: {
    color: "#333",
  },
  loginText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
