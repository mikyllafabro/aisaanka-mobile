import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Dimensions,
  Alert,
  Button,
  PanResponder,
} from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { FontAwesome, FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "@env";
import getCommuteSteps from "./CommuteGuide";
import polyline from "@mapbox/polyline";
// import Profile from "./profile";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

console.log("Loaded API Key:", GOOGLE_MAPS_API_KEY);

const { width, height } = Dimensions.get("window");

const Main = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destination, setDestination] = useState([]);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [searchBoxHeight, setSearchBoxHeight] = useState(height * 0.3);
  const mapRef = React.useRef(null); // Create reference for MapView
  const [commuteSteps, setCommuteSteps] = useState([]);
  const [isCommuteModalVisible, setIsCommuteModalVisible] = useState(false);
  const [modalHeight, setModalHeight] = useState(200); // Default height, can be dragged
  const [isCommuteGuideVisible, setIsCommuteGuideVisible] = useState(false);
  // const [sliderHeight, setSliderHeight] = useState(250); // Default height
  const [routeCoordinates, setRouteCoordinates] = useState([]); // Store polyline routes
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [detailedRoute, setDetailedRoute] = useState(null);
  const [isRouteDetailsModalVisible, setIsRouteDetailsModalVisible] =
    useState(false); // For route details modal
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null); // Track selected route
  const [isEndJourneyVisible, setIsEndJourneyVisible] = useState(false); // Track button visibility
  const navigation = useNavigation();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

// Update the Profile component with a more professional and visually appealing design

// Add this hardcoded Profile component
const Profile = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa", borderRadius: 12 }}>
      {/* Profile Header */}
      <View style={{ 
        alignItems: "center", 
        padding: 20, 
        backgroundColor: "#0b617e",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        marginBottom: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}>
        <View style={{
          width: 90,
          height: 90,
          backgroundColor: "white",
          borderRadius: 45,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        }}>
          <FontAwesome name="user-circle" size={80} color="#0b617e" />
        </View>
        <Text style={{ 
          fontSize: 22, 
          fontWeight: "bold", 
          color: "white", 
          marginTop: 15,
          letterSpacing: 0.5
        }}>
          Adrian Philip T Onda
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: "rgba(255,255,255,0.85)", 
          marginTop: 5,
        }}>
          adrianonda373@gmail.com
        </Text>
        
        {/* User Stats */}
        <View style={{
          flexDirection: "row",
          marginTop: 20,
          width: "100%",
          justifyContent: "space-around"
        }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>2</Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>Trips</Text>
          </View>
        </View>
      </View>

      {/* Travel History Section */}
      <View style={{ 
        backgroundColor: "white", 
        borderRadius: 12, 
        padding: 15, 
        margin: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <FontAwesome5 name="history" size={16} color="#0b617e" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 17, fontWeight: "bold", color: "#333" }}>
            Travel History
          </Text>
        </View>

        {/* MOA to Pasay */}
        <View style={{ 
          flexDirection: "row", 
          padding: 12, 
          backgroundColor: "#f9f9f9",
          borderRadius: 10,
          marginBottom: 10,
          borderLeftWidth: 4,
          borderLeftColor: "#0b617e",
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="route" size={14} color="#0b617e" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "#333" }}>
                MOA to Pasay
              </Text>
            </View>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 5, marginLeft: 22 }}>
              March 9, 2025 • 2:30 PM
            </Text>
            <View style={{ flexDirection: "row", marginTop: 8, marginLeft: 22 }}>
              <View style={{ 
                backgroundColor: "#e8f4f8", 
                paddingHorizontal: 10, 
                paddingVertical: 3, 
                borderRadius: 30, 
                flexDirection: "row",
                alignItems: "center"
              }}>
                <FontAwesome name="money" size={10} color="#0b617e" style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, color: "#0b617e", fontWeight: "500" }}>
                  ₱45.00
                </Text>
              </View>
              <View style={{ 
                backgroundColor: "#f0f8e8", 
                marginLeft: 8, 
                paddingHorizontal: 10, 
                paddingVertical: 3, 
                borderRadius: 30,
                flexDirection: "row",
                alignItems: "center"
              }}>
                <FontAwesome5 name="clock" size={10} color="#4a8c3f" style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, color: "#4a8c3f", fontWeight: "500" }}>
                  45 mins
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pasay to MOA */}
        <View style={{ 
          flexDirection: "row", 
          padding: 12,
          backgroundColor: "#f9f9f9",
          borderRadius: 10,
          borderLeftWidth: 4,
          borderLeftColor: "#0b617e"
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="route" size={14} color="#0b617e" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "#333" }}>
                Pasay to MOA
              </Text>
            </View>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 5, marginLeft: 22 }}>
              March 8, 2025 • 10:15 AM
            </Text>
            <View style={{ flexDirection: "row", marginTop: 8, marginLeft: 22 }}>
              <View style={{ 
                backgroundColor: "#e8f4f8", 
                paddingHorizontal: 10, 
                paddingVertical: 3, 
                borderRadius: 30, 
                flexDirection: "row",
                alignItems: "center"
              }}>
                <FontAwesome name="money" size={10} color="#0b617e" style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, color: "#0b617e", fontWeight: "500" }}>
                  ₱42.00
                </Text>
              </View>
              <View style={{ 
                backgroundColor: "#f0f8e8", 
                marginLeft: 8, 
                paddingHorizontal: 10, 
                paddingVertical: 3, 
                borderRadius: 30,
                flexDirection: "row",
                alignItems: "center"
              }}>
                <FontAwesome5 name="clock" size={10} color="#4a8c3f" style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, color: "#4a8c3f", fontWeight: "500" }}>
                  40 mins
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#f44336",
          margin: 15,
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3
        }}
        onPress={() => {
          router.push("/auth/login");
        }}
      >
        <FontAwesome name="sign-out" size={18} color="white" style={{ marginRight: 8 }} />
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

  AsyncStorage.getItem("token")
    .then((token) => {
      console.log("Token in Main Screen:", token); // Ensure token is present
    })
    .catch((error) => {
      console.log("Error retrieving token:", error);
    });

  // Get real-time location
  useEffect(() => {
    console.log("Detailed Route Data:", detailedRoute);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Request permission to access location
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature."
        );
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Get high-accuracy location
      });
      setLocation(userLocation.coords); // Save the real-time location coordinates
    })();
  }, [detailedRoute]);

  // Handle search for places using Google Places API
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.trim() === "") {
      setPlaces([]); // Clear results when input is empty
      return;
    }

    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&location=14.5995,120.9842&radius=50000&key=${GOOGLE_MAPS_API_KEY}`
      )
      .then((response) => {
        console.log("Autocomplete API Response:", response.data);

        if (!response.data.predictions) {
          console.error("Error: No predictions in API response.");
          setPlaces([]);
          return;
        }

        // Filter results that have a valid place_id
        const validPlaces = response.data.predictions.filter(
          (place) => place.place_id
        );

        setPlaces(validPlaces); // Save valid autocomplete suggestions
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Failed to fetch autocomplete results.");
      });
  };

  const selectPlace = async (place) => {
    try {
      console.log("Selected Place Data:", place);

      if (!place || !place.place_id) {
        Alert.alert("Error", "Invalid place data.");
        return;
      }

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=geometry,name,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
      );

      console.log("Google Place Details API Response:", response.data);

      if (!response.data || response.data.status !== "OK") {
        console.error("Google API Error:", response.data);
        Alert.alert("Error", "Google API did not return valid data.");
        return;
      }

      const result = response.data.result;

      if (!result || !result.geometry || !result.geometry.location) {
        console.error("No location data found in API response:", result);
        Alert.alert("Error", "Could not retrieve location details.");
        return;
      }

      const { lat, lng } = result.geometry.location;

      setSelectedLocation({
        latitude: lat,
        longitude: lng,
        name: result.name || "Unknown Location",
        address: result.formatted_address || "No address available",
      });

      setSearchQuery(result.name || ""); // Ensure search bar updates properly
      setPlaces([]); // Clear search results
    } catch (error) {
      console.error("Error fetching place details:", error);
      Alert.alert("Error", "Failed to retrieve place details.");
    }
  };

  const handleDestinationSearch = (text) => {
    setDestinationQuery(text);

    if (text.trim() === "") {
      setPlaces([]);
      return;
    }

    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&location=14.5995,120.9842&radius=50000&key=${GOOGLE_MAPS_API_KEY}`
      )
      .then((response) => {
        console.log("Destination Autocomplete API Response:", response.data);

        if (!response.data.predictions) {
          console.error("Error: No predictions in API response.");
          setPlaces([]);
          return;
        }

        const validPlaces = response.data.predictions.filter(
          (place) => place.place_id
        );

        setPlaces(validPlaces);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Failed to fetch destination results.");
      });
  };

  const selectDestination = async (place) => {
    try {
      console.log("Selected Destination Data:", place);

      if (!place || !place.place_id) {
        Alert.alert("Error", "Invalid destination data.");
        return;
      }

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=geometry,name,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
      );

      console.log("Google Place Details API Response:", response.data);

      if (!response.data || response.data.status !== "OK") {
        console.error("Google API Error:", response.data);
        Alert.alert("Error", "Google API did not return valid data.");
        return;
      }

      const result = response.data.result;

      if (!result || !result.geometry || !result.geometry.location) {
        console.error("No location data found in API response:", result);
        Alert.alert("Error", "Could not retrieve destination details.");
        return;
      }

      const { lat, lng } = result.geometry.location;

      setDestinationLocation({
        latitude: lat,
        longitude: lng,
        name: result.name || "Unknown Destination",
        address: result.formatted_address || "No address available",
      });

      setDestinationQuery(result.name || ""); // ✅ Ensure the input updates
      setPlaces([]); // ✅ Clear search results
      setIsEndJourneyVisible(true); // ✅ Show the end journey button
      setRouteCoordinates([]); // ✅ Clear previous route
    } catch (error) {
      console.error("Error fetching destination details:", error);
      Alert.alert("Error", "Failed to retrieve destination details.");
    }
  };

  // const calculateFare = async () => {
  // if (selectedLocation && destinationLocation) {
  //   try {
  //     const commuteData = await getCommuteSteps(selectedLocation, destinationLocation);

  //     if (commuteData.status !== "success") {
  //       Alert.alert("Error", "No available routes found.");
  //       return;
  //     }

  //     setAlternativeRoutes(commuteData.routes);
  //     setIsCommuteModalVisible(true);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     Alert.alert("Error", "Failed to calculate commute options.");
  //   }
  // } else {
  //   Alert.alert("Error", "Please select a source and destination.");
  // }
  // };

  // Add this hardcoded data near the beginning of your file, after the initial state declarations

  const hardcodedRoutes = [
    {
      id: "route1",
      summary: "Route via Jeepney and LRT",
      duration: "45 mins",
      fare: "₱45.00",
      polyline: [
        "mzrcBqkhjVpB{AjEoD~CkCnI{GvBgB|AgAz@q@bBsA~FyEfDoCzCwB`@S^_@n@k@d@a@TS\\Y\\[XWPQt@o@t@s@\\[ZWTOVMbAW|@G|@AjA@vB@dDJdELlCFhCFz@@",
        "oyqcBmwijVfFLzEJrBDhABt@@`A@lAB~@B~AD~@DdAFbAHjALhANfAPdATfAT`AV`AXhAZfA^dA`@dAd@bAf@`Aj@~@j@~@n@|@p@|@r@z@v@z@x@x@x@z@v@|@t@~@r@~@p@`Ar@`Al@dAl@dAj@fAf@hAd@hA`@lA^lA\\nAZpAVpATrARtAPtANvAJvAHxAFzADzA@|A?|AA~ACvEI`DGrCEdCEpCElCEjCEjCElCCnCE`DG|CG|CG`DGfDIdDIfDIfDIfDIhDIdDIhDIhDIjDIfDIhDIfDGfDGdDGdDGbDG`DG~CG~CG|CG|CE|CE|CE~CG~CCzCC|CC~CA~CA~CA|C?|C?|C@|C@|CB|CB|CB~CD~CB|CD|CD|CF|CF|CF|CH|CFzCHzCHxCJxCJvCLvCJtCJtCLtCLrCLrCNrCNpCNnCPnCPnCPnCRlCRlCRlCTjCTjCThCVhCVhCXfCXfCXfCZdCZdC\\dC\\bC^bC^`C^`C``C``CbHrQpE`M",
      ],
      steps: [
        {
          instruction: "Walk to Ayala Station",
          details: {
            line: "Walking",
            vehicle: "On foot",
            fare: "₱0.00",
            duration: "5 mins",
            trafficLevel: "low",
          },
        },
        {
          instruction: "Take LRT from Ayala to Buendia",
          details: {
            line: "LRT Line 1",
            vehicle: "Train",
            fare: "₱15.00",
            duration: "15 mins",
            trafficLevel: "moderate",
          },
        },
        {
          instruction: "Take Jeepney from Buendia to Makati",
          details: {
            line: "Buendia-Makati Route",
            vehicle: "Jeepney",
            fare: "₱12.00",
            duration: "20 mins",
            trafficLevel: "heavy",
          },
        },
        {
          instruction: "Walk to destination",
          details: {
            line: "Walking",
            vehicle: "On foot",
            fare: "₱0.00",
            duration: "5 mins",
            trafficLevel: "low",
          },
        },
      ],
    },
    {
      id: "route2",
      summary: "Route via Grab",
      duration: "25 mins",
      fare: "₱180.00",
      polyline: [
        "uzqcBsbijVnDmChJuHfDmCtAcArAaArAaA~@q@|@q@tEmDdDkCbA{@tAcAtCyB|D{C~@k@",
      ],
      steps: [
        {
          instruction: "Book Grab from your location",
          details: {
            line: "Grab Car",
            vehicle: "Car",
            fare: "₱180.00",
            duration: "25 mins",
            trafficLevel: "moderate",
          },
        },
      ],
    },
    {
      id: "route3",
      summary: "Route via Bus and MRT",
      duration: "50 mins",
      fare: "₱55.00",
      polyline: [
        "mzrcBqkhjVpB{AjEoD~CkCnI{GvBgB|AgAz@q@bBsA~FyEfDoCzCwB`@S^_@n@k@d@a@TS\\Y\\[XWTOV",
        "ozqcB{xijVhIw@tEa@fEc@`H}@nKkArD]rDUxDQ~AKtAQnBg@dBm@nB{@xA}@jBqA|AuAvAwA~A_CnAyBbBkDhAaCx@cBn@qAp@qA|@aBn@gAr@oAr@mAn@iAp@kA|@{Ax@uAz@uAbA{A`AyA~@sA|@mA|@kA~@kAv@cAv@aAv@}@v@}@v@}@v@{@x@{@z@y@|@y@|@w@~@u@~@s@`As@`As@`Aq@bAm@bAm@dAk@dAi@dAg@fAe@fAc@fA_@hA]jA[jAWlAUlASjAMnAKnAGnAEpACpA?pA@pADpAFpAJnALnANnARnAVlAXlAZlA`@lAb@lAf@jAh@lAj@jAn@jAp@hAr@hAt@hAv@fAx@fAz@fA|@dA`AdAbAdA`AdA`AdA`AdA`AdA`AdAb@b@b@d@b@f@b@d@b@f@b@f@`@h@`@h@`@h@`@h@`@j@`@j@^j@^l@^l@^l@^n@\\l@\\n@\\p@\\p@Zp@Zr@Zr@Zt@Xt@Xv@Xv@Vx@Vx@Vz@Tz@T|@T|@R|@R~@R~@P`APbAP`ARdARdATdAZnA~@~CdA`D~@~CRp@",
      ],
      steps: [
        {
          instruction: "Take Bus to MRT Station",
          details: {
            line: "Green Line Bus",
            vehicle: "Bus",
            fare: "₱15.00",
            duration: "20 mins",
            trafficLevel: "heavy",
          },
        },
        {
          instruction: "Take MRT from North to Taft",
          details: {
            line: "MRT Line 3",
            vehicle: "Train",
            fare: "₱25.00",
            duration: "25 mins",
            trafficLevel: "low",
          },
        },
        {
          instruction: "Walk to destination",
          details: {
            line: "Walking",
            vehicle: "On foot",
            fare: "₱0.00",
            duration: "5 mins",
            trafficLevel: "low",
          },
        },
      ],
    },
  ];

  // Then modify the calculateFare function to use the hardcoded data:

  const calculateFare = async () => {
    if (selectedLocation && destinationLocation) {
      try {
        // Instead of making an API call, just use the hardcoded data
        setAlternativeRoutes(hardcodedRoutes);
        setIsCommuteModalVisible(true);
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to calculate commute options.");
      }
    } else {
      Alert.alert("Error", "Please select a source and destination.");
    }
  };

  const calculateFareFromDistance = (distance) => {
    const ratePerKm = 10; // Example rate per kilometer
    const distanceInKm = distance / 1000; // Convert meters to kilometers
    return ratePerKm * distanceInKm; // Calculate fare
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const { dy } = gestureState;

      // Adjusting modal height dynamically while dragging
      let newHeight = modalHeight + dy;
      if (newHeight < height * 0.3) newHeight = height * 0.3; // Prevent shrinking too much
      if (newHeight > height * 0.7) newHeight = height * 0.7; // Prevent covering full screen

      setModalHeight(newHeight); // Update modal height dynamically
    },
    onPanResponderRelease: () => {},
  });

  // Focus map on current location
  const focusOnLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to use this feature."
      );
      return;
    }

    // Get the latest user location
    const userLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = userLocation.coords;

    try {
      // Fetch the address from Google Maps API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      console.log("Reverse Geocode Response:", response.data);

      if (response.data.status !== "OK" || !response.data.results.length) {
        throw new Error("No address found.");
      }

      const fetchedAddress = response.data.results[0].formatted_address; // Get the first result
      console.log("Fetched Address:", fetchedAddress);

      // Animate the map to the latest location
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000 // Animation duration
        );
      }

      // Update the selected location marker dynamically
      setSelectedLocation({
        latitude,
        longitude,
        name: "My Location",
        address: fetchedAddress,
      });

      // ✅ Update the first text input with the fetched location
      handleSearch(fetchedAddress); // This will trigger the existing search function
    } catch (error) {
      console.error("Error fetching address:", error);
      Alert.alert("Error", "Failed to retrieve address.");
    }
  };

  const handleMapPress = async (coordinate) => {
    const { latitude, longitude } = coordinate;

    try {
      // Fetch the address from Google Maps API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      console.log("Tapped Location Geocode Response:", response.data);

      if (response.data.status !== "OK" || !response.data.results.length) {
        throw new Error("No address found.");
      }

      const tappedAddress = response.data.results[0].formatted_address; // Get the first result
      console.log("Tapped Address:", tappedAddress);

      // Update the selected location marker dynamically
      setSelectedLocation({
        latitude,
        longitude,
        name: "Pinned Location",
        address: tappedAddress,
      });

      // ✅ Update the first text input with the tapped place name
      handleSearch(tappedAddress);
    } catch (error) {
      console.error("Error fetching tapped address:", error);
      Alert.alert("Error", "Failed to retrieve address for pinned location.");
    }
  };

  const decodePolyline = (encoded) => {
    if (!encoded) {
      console.error("Error: No encoded polyline data received.");
      return [];
    }

    try {
      return polyline.decode(encoded).map(([latitude, longitude]) => ({
        latitude,
        longitude,
      }));
    } catch (error) {
      console.error("Error decoding polyline:", error);
      return [];
    }
  };

  const handleRouteSelect = (item) => {
    console.log("Selected Route:", item); // Debugging log to confirm route selection
    setRouteCoordinates(item.polyline);
    getCommuteSteps(item.steps);
    setDetailedRoute(item); // Set the selected route's details
    setIsCommuteModalVisible(false); // Close the first modal (route selection)
    setIsRouteDetailsModalVisible(true); // Open the second modal (route details)
  };

  const handleEndJourney = () => {
    Alert.alert(
      "Thank you for using AISaanKa",
      "Would you like to leave a review?",
      [
        {
          text: "No",
          style: "cancel",
          onPress: () => router.push("../Screen/main"), // Navigate back to the main screen instead of index
        },
        {
          text: "Yes",
          onPress: () => {
            router.push("/Screen/Review", {
              journeyDetails: {
                startLocation: selectedLocation,
                endLocation: destinationLocation,
              },
            });
          },
        },
      ]
    );
  };

  const trafficStatus = (trafficLevel) => {
    // This function returns the appropriate color and text based on the traffic level
    let color, statusText;

    if (trafficLevel === "heavy") {
      color = "#EA4335"; // Red
      statusText = "Heavy Traffic";
    } else if (trafficLevel === "moderate") {
      color = "#FBBC04"; // Orange
      statusText = "Moderate Traffic";
    } else {
      color = "#34A853"; // Green
      statusText = "Low Traffic";
    }

    return { color, statusText };
  };

  return (
    <View className="flex-1">
      {/* Button to toggle sidebar */}
      <TouchableOpacity
        onPress={toggleSidebar}
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <FontAwesome name="bars" size={30} color="#0b617e" />
      </TouchableOpacity>

      {sidebarVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 280,
            backgroundColor: "#fff",
            padding: 20,
            zIndex: 9,
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={toggleSidebar}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,
              padding: 5,
            }}
          >
            <FontAwesome name="times" size={24} color="#0b617e" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
            Profile
          </Text>

          {/* Hardcoded Profile Component */}
          <Profile />
        </View>
      )}
      {/* Map Background */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: width, height: height - 56 }}
        ref={mapRef} // Reference for animation
        initialRegion={{
          latitude: 14.5995, // Metro Manila's latitude
          longitude: 120.9842, // Metro Manila's longitude
          latitudeDelta: 0.1, // Adjust to zoom level
          longitudeDelta: 0.1, // Adjust to zoom level
        }}
        showsUserLocation={true} // Show the user's location on the map
        onPress={(event) => handleMapPress(event.nativeEvent.coordinate)} // New feature
      >
        {selectedLocation?.latitude && selectedLocation?.longitude ? (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="Start"
          />
        ) : null}

        {destinationLocation?.latitude && destinationLocation?.longitude ? (
          <Marker
            coordinate={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            title="Destination"
          />
        ) : null}

        {/* Draw Route Lines */}
        {routeCoordinates.length > 0 &&
          routeCoordinates.map((encodedPolyline, index) => (
            <Polyline
              key={index}
              coordinates={decodePolyline(encodedPolyline)} // Decode the polyline to display the route
              strokeWidth={6} // Increase stroke width for better visibility
              strokeColor={
                index === 0
                  ? "#EA4335" // Red
                  : index === 1
                  ? "#FBBC04" // Yellow
                  : "#4285F4" // Blue
              }
            />
          ))}
        {commuteSteps.map((step, index) =>
          step.details && step.details.from?.lat && step.details.from?.lng ? (
            <Marker
              key={index}
              coordinate={{
                latitude: step.details.from.lat,
                longitude: step.details.from.lng,
              }}
              title={step.details.line}
            />
          ) : null
        )}
      </MapView>

      {isCommuteModalVisible && (
        <View
          style={{
            ...modalStyle,
            top: modalHeight,
            position: "absolute",
            bottom: 40,
            width: "100%",
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: height * 0.7,
            minHeight: height * 0.3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            zIndex: 5,
            top: modalHeight, // Apply dynamic height based on the pan responder
          }}
        >
          {/* Draggable Indicator */}
          <View
            {...panResponder.panHandlers}
            style={{
              alignSelf: "center",
              width: 50,
              height: 12,
              backgroundColor: "#888",
              borderRadius: 5,
              marginBottom: 10,
            }}
          />

          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Select a Route
          </Text>

          <FlatList
            data={alternativeRoutes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  handleRouteSelect(item);
                }}
                style={{
                  backgroundColor: "#f8f8f8",
                  padding: 15,
                  marginBottom: 10,
                  borderRadius: 10,
                  borderLeftWidth: 4,
                  borderLeftColor:
                    item.id === "route1"
                      ? "#EA4335"
                      : item.id === "route2"
                      ? "#FBBC04"
                      : "#4285F4",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  🚍 {item.summary}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Text>⏳ {item.duration}</Text>
                  <Text style={{ fontWeight: "bold" }}>💰 {item.fare}</Text>
                </View>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 300 }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 20,
              backgroundColor: "#4E5D6C",
              padding: 8,
              borderRadius: 20,
            }}
            onPress={() => setIsCommuteModalVisible(false)}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>✖</Text>
          </TouchableOpacity>
        </View>
      )}

      <View>
        {/* End Journey Button */}
        {isEndJourneyVisible && (
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              backgroundColor: "#4CAF50",
              padding: 15,
              borderRadius: 25,
              alignItems: "center",
            }}
            onPress={handleEndJourney}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>End Journey</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* {detailedRoute && detailedRoute.steps && detailedRoute.steps.length > 0 && ( */}
      {isRouteDetailsModalVisible &&
        detailedRoute &&
        detailedRoute.steps &&
        detailedRoute.steps.length > 0 && (
          <View style={{ ...modalStyle, top: modalHeight }}>
            {/* Draggable Indicator */}
            <View
              {...panResponder.panHandlers}
              style={{
                alignSelf: "center",
                width: 50,
                height: 12,
                backgroundColor: "#888",
                borderRadius: 5,
                marginBottom: 10,
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Route Details:
            </Text>
            {detailedRoute.steps &&
              detailedRoute.steps.map((step, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text>{step.instruction}</Text>
                  {step.details && (
                    <>
                      <Text>🚇 Line: {step.details.line}</Text>
                      <Text>🚍 Vehicle: {step.details.vehicle}</Text>
                      <Text>💵 Fare: {step.details.fare}</Text>
                      <Text>⏱ Duration: {step.details.duration}</Text>
                      {/* Traffic Analysis Section */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 10,
                          padding: 10,
                          borderWidth: 1,
                          borderRadius: 20,
                          borderColor: "#ccc",
                        }}
                      >
                        <View
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: 15 / 2,
                            backgroundColor: trafficStatus(
                              step.details.trafficLevel
                            ).color, // Dynamic color based on traffic level
                            marginRight: 10,
                          }}
                        />
                        <Text style={{ fontWeight: "bold" }}>
                          {trafficStatus(step.details.trafficLevel).statusText}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              ))}
            {/* Close Button */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 20,
                backgroundColor: "#4E5D6C",
                padding: 8,
                borderRadius: 20,
              }}
              onPress={() => setIsRouteDetailsModalVisible(false)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>✖</Text>
            </TouchableOpacity>
          </View>
        )}

      {/* Bottom Search Section */}
      <View
        style={{
          opacity: 0.95,
          position: "absolute",
          top: 10,
          left: 50,
          right: 54,
          backgroundColor: "#03624C",
          borderRadius: 20,
          padding: 2,
          elevation: 1,
          shadowColor: "#030F0F",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 25,
        }}
      >
        {/* Draggable Indicator (Line) */}
        {/* <View style={{ alignSelf: "center", width: 40, height: 5, backgroundColor: "#00DF82", borderRadius: 5, marginBottom: 2 }} /> */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <FontAwesome name="map-marker" size={20} color="red" margin="13" />
          <TextInput
            placeholder="Select Your Location"
            value={searchQuery || ""}
            onChangeText={handleSearch}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              color: "white",
              fontWeight: "bold",
            }}
          />
        </View>

        {/* Display Start Search Results */}
        {places.length > 0 && (
          <FlatList
            data={places}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectPlace(item)}
                style={{ paddingVertical: 15, marginHorizontal: 15 }}
              >
                <Text className="text-white text-sm">{item.description}</Text>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 50, marginBottom: 3 }}
          />
        )}

        {/* Destination Search Bar */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome
            name="flag-checkered"
            size={18}
            color="lightgreen"
            margin="10"
          />
          <TextInput
            placeholder="Select Destination"
            value={destinationQuery || ""}
            onChangeText={handleDestinationSearch}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              color: "white",
              fontWeight: "bold",
            }}
          />
        </View>

        {/* Display Destination Search Results */}
        {places.length > 0 && (
          <FlatList
            data={places}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectDestination(item)}
                style={{ paddingVertical: 15, marginHorizontal: 15 }}
              >
                <Text className="text-white text-sm">{item.description}</Text>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 50, marginBottom: 3 }}
          />
        )}

        {/* {selectedLocation && (
          <View style={{ padding: 10 }}>
            <Text className="text-white text-lg font-bold">{selectedLocation.name}</Text>
            <Text className="text-white text-sm">{selectedLocation.address}</Text>
          </View>
        )} */}
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: searchBoxHeight + 70,
          right: 20,
          backgroundColor: "#4E5D6C",
          padding: 10,
          borderRadius: 50,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 4.65,
        }}
        onPress={calculateFare}
      >
        <FontAwesome5 name="directions" size={24} color="white" />
      </TouchableOpacity>

      {/* Focus on Location Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: searchBoxHeight + 20,
          right: 20,
          backgroundColor: "#4E5D6C",
          padding: 10,
          borderRadius: 50,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 4.65,
          pinColor: "red",
        }}
        onPress={focusOnLocation}
      >
        <FontAwesome6 name="location-crosshairs" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const modalStyle = {
  position: "absolute",
  bottom: 40,
  width: "100%",
  backgroundColor: "#fff",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  maxHeight: height * 0.7,
  minHeight: height * 0.3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  zIndex: 5,
};

export default Main;
