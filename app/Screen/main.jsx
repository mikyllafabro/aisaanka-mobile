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
import Profile from "./profile";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import  baseURL from "../../assets/common/baseUrl";

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
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [destinationSearchTimeout, setDestinationSearchTimeout] = useState(null);
  const [isOriginFocused, setIsOriginFocused] = useState(true); // Track which search field is active
  const [destinationPlaces, setDestinationPlaces] = useState([]); // Separate state for destination results

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

// Update the Profile component with a more professional and visually appealing design

// Add this hardcoded Profile component
// const Profile = () => {
//   return (
//     <View style={{ flex: 1, backgroundColor: "#f8f9fa", borderRadius: 12 }}>
//       {/* Profile Header */}
//       <View style={{ 
//         alignItems: "center", 
//         padding: 20, 
//         backgroundColor: "#0b617e",
//         borderTopLeftRadius: 12,
//         borderTopRightRadius: 12,
//         marginBottom: 0,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//       }}>
//         <View style={{
//           width: 90,
//           height: 90,
//           backgroundColor: "white",
//           borderRadius: 45,
//           justifyContent: "center",
//           alignItems: "center",
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 3 },
//           shadowOpacity: 0.2,
//           shadowRadius: 5,
//           elevation: 5,
//         }}>
//           <FontAwesome name="user-circle" size={80} color="#0b617e" />
//         </View>
//         <Text style={{ 
//           fontSize: 22, 
//           fontWeight: "bold", 
//           color: "white", 
//           marginTop: 15,
//           letterSpacing: 0.5
//         }}>
//           Adrian Philip T Onda
//         </Text>
//         <Text style={{ 
//           fontSize: 14, 
//           color: "rgba(255,255,255,0.85)", 
//           marginTop: 5,
//         }}>
//           adrianonda373@gmail.com
//         </Text>
        
//         {/* User Stats */}
//         <View style={{
//           flexDirection: "row",
//           marginTop: 20,
//           width: "100%",
//           justifyContent: "space-around"
//         }}>
//           <View style={{ alignItems: "center" }}>
//             <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>2</Text>
//             <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>Trips</Text>
//           </View>
//         </View>
//       </View>

//       {/* Travel History Section */}
//       <View style={{ 
//         backgroundColor: "white", 
//         borderRadius: 12, 
//         padding: 15, 
//         margin: 15,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 2
//       }}>
//         <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
//           <FontAwesome5 name="history" size={16} color="#0b617e" style={{ marginRight: 8 }} />
//           <Text style={{ fontSize: 17, fontWeight: "bold", color: "#333" }}>
//             Travel History
//           </Text>
//         </View>

//         {/* MOA to Pasay */}
//         <View style={{ 
//           flexDirection: "row", 
//           padding: 12, 
//           backgroundColor: "#f9f9f9",
//           borderRadius: 10,
//           marginBottom: 10,
//           borderLeftWidth: 4,
//           borderLeftColor: "#0b617e",
//         }}>
//           <View style={{ flex: 1 }}>
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <FontAwesome5 name="route" size={14} color="#0b617e" style={{ marginRight: 8 }} />
//               <Text style={{ fontSize: 15, fontWeight: "bold", color: "#333" }}>
//                 MOA to Pasay
//               </Text>
//             </View>
//             <Text style={{ color: "#666", fontSize: 12, marginTop: 5, marginLeft: 22 }}>
//               March 9, 2025 • 2:30 PM
//             </Text>
//             <View style={{ flexDirection: "row", marginTop: 8, marginLeft: 22 }}>
//               <View style={{ 
//                 backgroundColor: "#e8f4f8", 
//                 paddingHorizontal: 10, 
//                 paddingVertical: 3, 
//                 borderRadius: 30, 
//                 flexDirection: "row",
//                 alignItems: "center"
//               }}>
//                 <FontAwesome name="money" size={10} color="#0b617e" style={{ marginRight: 4 }} />
//                 <Text style={{ fontSize: 12, color: "#0b617e", fontWeight: "500" }}>
//                   ₱45.00
//                 </Text>
//               </View>
//               <View style={{ 
//                 backgroundColor: "#f0f8e8", 
//                 marginLeft: 8, 
//                 paddingHorizontal: 10, 
//                 paddingVertical: 3, 
//                 borderRadius: 30,
//                 flexDirection: "row",
//                 alignItems: "center"
//               }}>
//                 <FontAwesome5 name="clock" size={10} color="#4a8c3f" style={{ marginRight: 4 }} />
//                 <Text style={{ fontSize: 12, color: "#4a8c3f", fontWeight: "500" }}>
//                   45 mins
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Pasay to MOA */}
//         <View style={{ 
//           flexDirection: "row", 
//           padding: 12,
//           backgroundColor: "#f9f9f9",
//           borderRadius: 10,
//           borderLeftWidth: 4,
//           borderLeftColor: "#0b617e"
//         }}>
//           <View style={{ flex: 1 }}>
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <FontAwesome5 name="route" size={14} color="#0b617e" style={{ marginRight: 8 }} />
//               <Text style={{ fontSize: 15, fontWeight: "bold", color: "#333" }}>
//                 Pasay to MOA
//               </Text>
//             </View>
//             <Text style={{ color: "#666", fontSize: 12, marginTop: 5, marginLeft: 22 }}>
//               March 8, 2025 • 10:15 AM
//             </Text>
//             <View style={{ flexDirection: "row", marginTop: 8, marginLeft: 22 }}>
//               <View style={{ 
//                 backgroundColor: "#e8f4f8", 
//                 paddingHorizontal: 10, 
//                 paddingVertical: 3, 
//                 borderRadius: 30, 
//                 flexDirection: "row",
//                 alignItems: "center"
//               }}>
//                 <FontAwesome name="money" size={10} color="#0b617e" style={{ marginRight: 4 }} />
//                 <Text style={{ fontSize: 12, color: "#0b617e", fontWeight: "500" }}>
//                   ₱42.00
//                 </Text>
//               </View>
//               <View style={{ 
//                 backgroundColor: "#f0f8e8", 
//                 marginLeft: 8, 
//                 paddingHorizontal: 10, 
//                 paddingVertical: 3, 
//                 borderRadius: 30,
//                 flexDirection: "row",
//                 alignItems: "center"
//               }}>
//                 <FontAwesome5 name="clock" size={10} color="#4a8c3f" style={{ marginRight: 4 }} />
//                 <Text style={{ fontSize: 12, color: "#4a8c3f", fontWeight: "500" }}>
//                   40 mins
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    trips: 0,
    travelHistory: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("No token found, user needs to login");
          router.push("/Auth/Login");
          return;
        }

        console.log("Attempting to fetch user profile with token:", token.substring(0, 15) + "...");

        const response = await axios.get(`${baseURL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("User profile data:", response.data);
        
        let tripHistory = [];

      try {
        const tripsResponse = await axios.get(`${baseURL}/api/places/trips`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Trips response:", tripsResponse.data);
        
        if (tripsResponse.data && Array.isArray(tripsResponse.data.trips)) {
          tripHistory = tripsResponse.data.trips;
          console.log("Fetched trip history:", tripHistory);
        }
      } catch (tripError) {
        console.error("Error fetching trip history:", tripError);
        console.log("Using placeholder trip history data instead");

        tripHistory = [
          {
            id: "1",
            from: "SM Mall of Asia",
            to: "Pasay City",
            date: "March 9, 2025",
            time: "2:30 PM",
            fare: "₱45.00",
            duration: "45 mins"
          },
          {
            id: "2",
            from: "Pasay City",
            to: "SM Mall of Asia",
            date: "March 8, 2025",
            time: "10:15 AM",
            fare: "₱42.00",
            duration: "40 mins"
          }
        ];
      }

        if (response.data) {
          setUserData({
            name: response.data.name || response.data.username || "User",
            email: response.data.email || "No email provided",
            category: response.data.category || "",
            age: response.data.age || "",
            trips: tripHistory.length || 0,
            travelHistory: tripHistory
          });
        }
        console.log("User data set successfully:", {
          name: response.data.name || response.data.username || "User",
          email: response.data.email || "No email provided"
        });
        setIsLoading(false);
        setRefreshing(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        
        // Use placeholder data as fallback
    setUserData({
      name: "User",
      email: "Authentication error",
      trips: 0,
      travelHistory: [
        {
          id: "placeholder-1",
          from: "MOA",
          to: "Pasay",
          date: "March 9, 2025",
          time: "2:30 PM",
          fare: "₱45.00",
          duration: "45 mins"
        },
        {
          id: "placeholder-2",
          from: "Pasay",
          to: "MOA",
          date: "March 8, 2025",
          time: "10:15 AM",
          fare: "₱42.00",
          duration: "40 mins"
        }
      ]
    });
    setIsLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

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
          {isLoading ? "Loading..." : userData.name}
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: "rgba(255,255,255,0.85)", 
          marginTop: 5,
        }}>
          {isLoading ? "Loading..." : userData.email}
        </Text>
        
        {/* User Stats */}
        <View style={{
          flexDirection: "row",
          marginTop: 20,
          width: "100%",
          justifyContent: "space-around"
        }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {isLoading ? "-" : userData.trips}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>Trips</Text>
          </View>
        </View>
      </View>

      {/* Travel History Section with Pull-to-refresh */}
      <View style={{ 
        backgroundColor: "white", 
        borderRadius: 12, 
        padding: 15, 
        margin: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        flex: 1
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <FontAwesome5 name="history" size={16} color="#0b617e" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 17, fontWeight: "bold", color: "#333" }}>
            Travel History
          </Text>
          {/* Add refresh button */}
          <TouchableOpacity 
            onPress={handleRefresh} 
            style={{ marginLeft: 'auto' }}
          >
            <FontAwesome5 
              name="sync" 
              size={14} 
              color="#0b617e" 
              style={{ padding: 5 }}
            />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Loading travel history...</Text>
          </View>
          ) : refreshing ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>Refreshing data...</Text>
            </View>
        ) : userData.travelHistory && userData.travelHistory.length > 0 ? (
          <FlatList
            data={userData.travelHistory}
            keyExtractor={(item) => item.id || String(Math.random())}
            renderItem={({ item }) => (
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
                      {item.from} to {item.to}
                    </Text>
                  </View>
                  <Text style={{ color: "#666", fontSize: 12, marginTop: 5, marginLeft: 22 }}>
                    {item.date} • {item.time}
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
                        {item.fare}
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
                        {item.duration}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>No travel history found</Text>
          </View>
        )}
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
          router.push("/Auth/Login");
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

  const handleSearch = (text) => {
    setSearchQuery(text);
    setIsOriginFocused(true); // Set focus to origin search
    setDestinationPlaces([]); // Clear destination results when searching for origin
  
    if (text.trim() === "") {
      setPlaces([]); // Clear results when input is empty
      return;
    }
  
    // Add a delay before making API request to avoid excessive calls
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
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
    }, 300);
    
    setSearchTimeout(timeout);
  }; 

  const selectPlace = async (place) => {
    try {
      console.log("Selected Place Data:", place);
  
      if (!place || !place.place_id) {
        Alert.alert("Error", "Invalid place data.");
        return;
      }
  
      // Show loading indicator while fetching
      setSearchQuery("Loading...");
  
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=geometry,name,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
      );
  
      console.log("Google Place Details API Response:", response.data);
  
      if (!response.data || response.data.status !== "OK") {
        console.error("Google API Error:", response.data);
        Alert.alert("Error", "Google API did not return valid data.");
        // Restore previous search query if there's an error
        setSearchQuery(searchQuery);
        return;
      }
  
      const result = response.data.result;
  
      if (!result || !result.geometry || !result.geometry.location) {
        console.error("No location data found in API response:", result);
        Alert.alert("Error", "Could not retrieve location details.");
        // Restore previous search query if there's an error
        setSearchQuery(searchQuery);
        return;
      }
  
      const { lat, lng } = result.geometry.location;
      const locationName = result.name || place.structured_formatting?.main_text || "Selected Location";
  
      setSelectedLocation({
        latitude: lat,
        longitude: lng,
        name: locationName,
        address: result.formatted_address || place.description || "No address available",
      });
  
      setSearchQuery(locationName); // Update search bar with the proper name
      setPlaces([]); // Clear search results
      setTimeout(() => setPlaces([]), 100);
      Keyboard.dismiss();

      
      // Animate map to the selected location
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          1000
        );
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      Alert.alert("Error", "Failed to retrieve place details.");
      // Restore previous search query if there's an error
      setSearchQuery(searchQuery);
    }
  };

  const handleDestinationSearch = (text) => {
    setDestinationQuery(text);
    setIsOriginFocused(false); // Set focus to destination search
    setPlaces([]); // Clear origin results when searching for destination
  
    if (text.trim() === "") {
      setDestinationPlaces([]); // Clear results when input is empty
      return;
    }
  
    // Add a delay before making API request to avoid excessive calls
    if (destinationSearchTimeout) clearTimeout(destinationSearchTimeout);
    
    const timeout = setTimeout(() => {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&location=14.5995,120.9842&radius=50000&key=${GOOGLE_MAPS_API_KEY}`
        )
        .then((response) => {
          console.log("Destination Autocomplete API Response:", response.data);
  
          if (!response.data.predictions) {
            console.error("Error: No predictions in API response.");
            setDestinationPlaces([]);
            return;
          }
          const validPlaces = response.data.predictions.filter(
            (place) => place.place_id
          );
  
          setDestinationPlaces(validPlaces); // Save to destination-specific state
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Error", "Failed to fetch destination results.");
        });
    }, 300);
    
    setDestinationSearchTimeout(timeout);
  };


const selectDestination = async (place) => {
  try {
    console.log("Selected Destination Data:", place);

    if (!place || !place.place_id) {
      Alert.alert("Error", "Invalid destination data.");
      return;
    }

    // Show loading indicator while fetching
    setDestinationQuery("Loading...");

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=geometry,name,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
    );

    console.log("Google Place Details API Response:", response.data);

    if (!response.data || response.data.status !== "OK") {
      console.error("Google API Error:", response.data);
      Alert.alert("Error", "Google API did not return valid data.");
      // Restore previous query if there's an error
      setDestinationQuery(destinationQuery);
      setDestinationPlaces([]);
      return;
    }

    const result = response.data.result;

    if (!result || !result.geometry || !result.geometry.location) {
      console.error("No location data found in API response:", result);
      Alert.alert("Error", "Could not retrieve destination details.");
      // Restore previous query if there's an error
      setDestinationQuery("");
      setDestinationPlaces([]);
      return;
    }

    const { lat, lng } = result.geometry.location;
    const locationName = result.name || place.structured_formatting?.main_text || "Selected Destination";

    setDestinationLocation({
      latitude: lat,
      longitude: lng,
      name: locationName,
      address: result.formatted_address || place.description || "No address available",
    });

    setDestinationQuery(locationName); // Update search bar properly
    setDestinationPlaces([]);
    setPlaces([]); // Clear search results
    setIsEndJourneyVisible(true); // Show the end journey button
    
    // Clear any previous route
    setRouteCoordinates([]);

    if (mapRef.current && selectedLocation) {
      const edgePadding = { top: 100, right: 100, bottom: 100, left: 100 };
      mapRef.current.fitToCoordinates(
        [
          { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude },
          { latitude: lat, longitude: lng }
        ],
        { edgePadding, animated: true }
      );
    } else if (mapRef.current) {
      // If no starting point, just focus on destination
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  } catch (error) {
    console.error("Error fetching destination details:", error);
    Alert.alert("Error", "Failed to retrieve destination details.");
    // Restore previous query if there's an error
    setDestinationQuery(destinationQuery);
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

  const focusOnLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature."
        );
        return;
      }
  
      // Show loading indicator
      setSearchQuery("Locating...");
  
      // Get the latest user location with high accuracy
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000, // Use a location no older than 10 seconds
      });
  
      const { latitude, longitude } = userLocation.coords;
  
      try {
        // Fetch the address from Google Maps API
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.status !== "OK" || !response.data.results.length) {
          throw new Error("No address found.");
        }
  
        const fetchedAddress = response.data.results[0].formatted_address; // Get the first result
        const addressComponents = response.data.results[0].address_components;
        
        // Try to get a more friendly name for the location
        let locationName = "Current Location";
        
        // Check for establishment name or street address
        const establishment = addressComponents.find(component => 
          component.types.includes("establishment")
        );
        
        const route = addressComponents.find(component => 
          component.types.includes("route")
        );
        
        const streetNumber = addressComponents.find(component => 
          component.types.includes("street_number")
        );
        
        if (establishment) {
          locationName = establishment.long_name;
        } else if (route) {
          locationName = streetNumber ? 
            `${streetNumber.long_name} ${route.long_name}` : 
            route.long_name;
        }

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000 // Animation duration
          );
        }
  
        // Update the selected location marker dynamically
        setSelectedLocation({
          latitude,
          longitude,
          name: locationName,
          address: fetchedAddress,
        });
  
        // Update the first text input with the fetched location
        setSearchQuery(locationName);
        
      } catch (error) {
        console.error("Error fetching address:", error);

        setSelectedLocation({
          latitude,
          longitude,
          name: "My Location",
          address: "Unknown Address",
        });
        
        setSearchQuery("My Location");
        
        // Still animate the map to the location
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
        }
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Location Error", "Failed to get your current location. Please check your device settings and try again.");
      setSearchQuery(""); // Reset the loading text
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

  const handleEndJourney = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You need to be logged in to save your trip.");
        return;
      }
  
      // Calculate fare and duration based on your app's logic
      const fareAmount = detailedRoute?.fare || "₱" + (Math.floor(Math.random() * 50) + 30) + ".00";
      const durationMinutes = detailedRoute?.duration || (Math.floor(Math.random() * 30) + 15) + " mins";
  
      // Prepare trip data
      const newTrip = {
        from: selectedLocation?.name || "Unknown location",
        to: destinationLocation?.name || "Unknown destination",
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        fare: fareAmount,
        duration: durationMinutes
      };
  
    console.log("Saving trip data:", newTrip);
    console.log("API endpoint:", `${baseURL}/api/places/trips`);
    console.log("Token for authorization:", token.substring(0, 15) + "...");


      // Save trip to API
      const response = await axios.post(
        `${baseURL}/api/places/trips`,
        { trip: newTrip },  // Wrap in trip object to match controller expectations
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log("Trip saved successfully:", response.data);
  
      Alert.alert(
        "Thank you for using AISaanKa",
        "Would you like to leave a review?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: () => {
              // Reset navigation and selections
              setSelectedLocation(null);
              setDestinationLocation(null);
              setSearchQuery("");
              setDestinationQuery("");
              setIsEndJourneyVisible(false);
              setRouteCoordinates([]);
              setDetailedRoute(null);
            }
          },
          {
            text: "Yes",
            onPress: () => {
              router.push("/Screen/Review", {
                journeyDetails: {
                  startLocation: selectedLocation,
                  endLocation: destinationLocation,
                  fare: fareAmount,
                  duration: durationMinutes
                },
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error saving trip:", error);
      Alert.alert(
        "Error Saving Trip",
        "Your trip couldn't be saved to your history, but you can still leave a review.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Leave Review",
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
    }
  };

  // const handleEndJourney = () => {

    

  //   Alert.alert(
  //     "Thank you for using AISaanKa",
  //     "Would you like to leave a review?",
  //     [
  //       {
  //         text: "No",
  //         style: "cancel",
  //         onPress: () => router.push("../Screen/main"), // Navigate back to the main screen instead of index
  //       },
  //       {
  //         text: "Yes",
  //         onPress: () => {
  //           router.push("/Screen/Review", {
  //             journeyDetails: {
  //               startLocation: selectedLocation,
  //               endLocation: destinationLocation,
  //             },
  //           });
  //         },
  //       },
  //     ]
  //   );
  // };

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
  <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
    {/* Map Background */}
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ width: width, height: height }}
      ref={mapRef}
      initialRegion={{
        latitude: 14.5995,
        longitude: 120.9842,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      showsUserLocation={true}
      onPress={(event) => handleMapPress(event.nativeEvent.coordinate)}
    >
      {selectedLocation?.latitude && selectedLocation?.longitude ? (
        <Marker
          coordinate={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }}
          title="Start"
          pinColor="#0b617e"
        />
      ) : null}

      {destinationLocation?.latitude && destinationLocation?.longitude ? (
        <Marker
          coordinate={{
            latitude: destinationLocation.latitude,
            longitude: destinationLocation.longitude,
          }}
          title="Destination"
          pinColor="#34A853"
        />
      ) : null}

      {/* Draw Route Lines */}
      {routeCoordinates.length > 0 &&
        routeCoordinates.map((encodedPolyline, index) => (
          <Polyline
            key={index}
            coordinates={decodePolyline(encodedPolyline)}
            strokeWidth={5}
            strokeColor={
              index === 0
                ? "#0b617e" // Primary app color
                : index === 1
                ? "#4285F4" // Blue
                : "#34A853" // Green
            }
            lineDashPattern={[0]}
            lineCap="round"
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

    {/* Button to toggle sidebar */}
    <TouchableOpacity
      onPress={toggleSidebar}
      style={{
        position: "absolute",
        top: 45,
        left: 20,
        zIndex: 10,
        backgroundColor: "white",
        padding: 12,
        borderRadius: 50,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <FontAwesome name="bars" size={22} color="#0b617e" />
    </TouchableOpacity>

    {/* Sidebar */}
    {sidebarVisible && (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 300,
          backgroundColor: "#fff",
          padding: 0,
          paddingTop: 0,
          zIndex: 99,
          shadowColor: "#000",
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        {/* Close button */}
        <TouchableOpacity
          onPress={toggleSidebar}
          style={{
            position: "absolute",
            top: 45,
            right: 20,
            zIndex: 100,
            backgroundColor: "white",
            padding: 8,
            borderRadius: 50,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
          }}
        >
          <FontAwesome name="times" size={22} color="#0b617e" />
        </TouchableOpacity>

        {/* Hardcoded Profile Component */}
        <Profile />
      </View>
    )}

    {/* Search Container */}
    <View
        style={{
          position: "absolute",
          top: 45,
          left: 70,
          right: 20,
          backgroundColor: "white",
          borderRadius: 12,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          padding: 12,
        }}
      >
      {/* Search Bars Container */}
      <View style={{ backgroundColor: "white", borderRadius: 12 }}>
          {/* Start Location Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#f0f0f0",
              backgroundColor: isOriginFocused ? "#f5f9fc" : "white", // Highlight active field
            }}
          >
            <View style={{ 
              backgroundColor: "#e8f4f8", 
              padding: 8, 
              borderRadius: 50,
              marginRight: 10,
            }}>
              <FontAwesome name="map-marker" size={16} color="#0b617e" />
            </View>
            <TextInput
              placeholder="Your Location"
              value={searchQuery || ""}
              onChangeText={handleSearch}
              onFocus={() => setIsOriginFocused(true)}
              style={{
                flex: 1,
                fontSize: 15,
                color: "#333",
              }}
              placeholderTextColor="#999"
            />
            
            {/* Add a clear button if there's text */}
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setPlaces([]);
                }}
                style={{ padding: 8 }}
              >
                <FontAwesome name="times-circle" size={16} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>

        {/* Destination Search Bar */}
        <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 8,
              backgroundColor: !isOriginFocused ? "#f7fbf6" : "white", // Highlight active field
            }}
          >
            <View style={{ 
              backgroundColor: "#f0f8e8", 
              padding: 8, 
              borderRadius: 50,
              marginRight: 10,
            }}>
              <FontAwesome name="flag-checkered" size={16} color="#34A853" />
            </View>
            <TextInput
              placeholder="Your Destination"
              value={destinationQuery || ""}
              onChangeText={handleDestinationSearch}
              onFocus={() => setIsOriginFocused(false)}
              style={{
                flex: 1,
                fontSize: 15,
                color: "#333",
              }}
              placeholderTextColor="#999"
            />
          {destinationQuery ? (
              <TouchableOpacity
                onPress={() => {
                  setDestinationQuery("");
                  setDestinationPlaces([]);
                }}
                style={{ padding: 8 }}
              >
                <FontAwesome name="times-circle" size={16} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

    {/* Display Search Results */}
    {isOriginFocused && places.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: 135,
            left: 70,
            right: 20,
            backgroundColor: "white",
            borderRadius: 12,
            padding: 5,
            maxHeight: 200,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            zIndex: 8,
          }}
        >
<FlatList
            data={places}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectPlace(item)}
                style={{ 
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f0f0f0"
                }}
              >
                <Text style={{ fontSize: 14, color: "#333" }}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

{!isOriginFocused && destinationPlaces.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: 135,
            left: 70,
            right: 20,
            backgroundColor: "white",
            borderRadius: 12,
            padding: 5,
            maxHeight: 200,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            zIndex: 8,
          }}
        >

<FlatList
            data={destinationPlaces}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectDestination(item)}
                style={{ 
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f0f0f0"
                }}
              >
                <Text style={{ fontSize: 14, color: "#333" }}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    {/* Action Buttons */}
    <View
      style={{
        position: "absolute",
        bottom: 30,
        right: 20,
        alignItems: "center",
      }}
    >
      {/* Calculate Route Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#0b617e",
          padding: 16,
          borderRadius: 50,
          marginBottom: 15,
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
        onPress={calculateFare}
      >
        <FontAwesome5 name="directions" size={22} color="white" />
      </TouchableOpacity>

      {/* Focus on Location Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: "#0b617e",
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
        onPress={focusOnLocation}
      >
        <FontAwesome6 name="location-crosshairs" size={20} color="#0b617e" />
      </TouchableOpacity>
    </View>

    {/* End Journey Button */}
    {isEndJourneyVisible && (
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 30,
          left: 20,
          right: 80,
          backgroundColor: "#34A853",
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
        onPress={handleEndJourney}
      >
        <FontAwesome5 name="flag-checkered" size={16} color="white" style={{ marginRight: 8 }} />
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>End Journey</Text>
      </TouchableOpacity>
    )}

    {/* Route Selection Modal */}
    {isCommuteModalVisible && (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 20,
          paddingTop: 15,
          paddingBottom: 30,
          maxHeight: height * 0.7,
          minHeight: height * 0.3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 10,
          zIndex: 5,
        }}
      >
        {/* Draggable Indicator */}
        <View
          {...panResponder.panHandlers}
          style={{
            alignSelf: "center",
            width: 50,
            height: 5,
            backgroundColor: "#ddd",
            borderRadius: 5,
            marginBottom: 15,
          }}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#0b617e" }}>
            Available Routes
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#f5f5f5",
              padding: 8,
              borderRadius: 50,
            }}
            onPress={() => setIsCommuteModalVisible(false)}
          >
            <FontAwesome name="times" size={16} color="#555" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={alternativeRoutes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handleRouteSelect(item);
              }}
              style={{
                backgroundColor: "#f8f9fa",
                padding: 16,
                marginBottom: 15,
                borderRadius: 12,
                borderLeftWidth: 5,
                borderLeftColor:
                  item.id === "route1"
                    ? "#0b617e"
                    : item.id === "route2"
                    ? "#FBBC04"
                    : "#4285F4",
                elevation: 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333", marginBottom: 8 }}>
                {item.summary}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name="clock" size={14} color="#666" style={{ marginRight: 5 }} />
                  <Text style={{ color: "#666" }}>{item.duration}</Text>
                </View>
                <Text style={{ fontWeight: "bold", color: "#0b617e" }}>{item.fare}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={{ maxHeight: 350 }}
        />
      </View>
    )}

    {/* Route Details Modal */}
    {isRouteDetailsModalVisible &&
      detailedRoute &&
      detailedRoute.steps &&
      detailedRoute.steps.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 15,
            paddingBottom: 30,
            maxHeight: height * 0.7,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 10,
            zIndex: 5,
          }}
        >
          {/* Draggable Indicator */}
          <View
            {...panResponder.panHandlers}
            style={{
              alignSelf: "center",
              width: 50,
              height: 5,
              backgroundColor: "#ddd",
              borderRadius: 5,
              marginBottom: 15,
            }}
          />
          
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#0b617e" }}>
              Journey Details
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#f5f5f5",
                padding: 8,
                borderRadius: 50,
              }}
              onPress={() => setIsRouteDetailsModalVisible(false)}
            >
              <FontAwesome name="times" size={16} color="#555" />
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20, paddingHorizontal: 10 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#666", fontSize: 13 }}>Total Duration</Text>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: "#0b617e" }}>{detailedRoute.duration}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#666", fontSize: 13 }}>Total Fare</Text>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: "#0b617e" }}>{detailedRoute.fare}</Text>
            </View>
          </View>

          <FlatList
            data={detailedRoute.steps}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View 
                style={{ 
                  marginBottom: 15,
                  backgroundColor: "#f8f9fa",
                  padding: 15,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: trafficStatus(item.details?.trafficLevel || "low").color
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <View style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#0b617e",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10
                  }}>
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{index + 1}</Text>
                  </View>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.instruction}</Text>
                </View>
                
                {item.details && (
                  <View style={{ paddingLeft: 38 }}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
                      <View style={{ 
                        flexDirection: "row", 
                        alignItems: "center", 
                        backgroundColor: "#e8f4f8",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 20,
                        marginRight: 8,
                        marginBottom: 8
                      }}>
                        <FontAwesome5 name={
                          item.details.vehicle === "Train" ? "train" :
                          item.details.vehicle === "Bus" ? "bus" :
                          item.details.vehicle === "Jeepney" ? "bus-alt" :
                          item.details.vehicle === "Car" ? "car" : "walking"
                        } size={12} color="#0b617e" style={{ marginRight: 5 }} />
                        <Text style={{ fontSize: 12, color: "#0b617e" }}>{item.details.vehicle}</Text>
                      </View>
                      
                      <View style={{ 
                        flexDirection: "row", 
                        alignItems: "center", 
                        backgroundColor: "#f0f8e8",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 20,
                        marginRight: 8,
                        marginBottom: 8
                      }}>
                        <FontAwesome5 name="clock" size={12} color="#4a8c3f" style={{ marginRight: 5 }} />
                        <Text style={{ fontSize: 12, color: "#4a8c3f" }}>{item.details.duration}</Text>
                      </View>
                      
                      <View style={{ 
                        flexDirection: "row", 
                        alignItems: "center", 
                        backgroundColor: "#fff4e8",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 20,
                        marginBottom: 8
                      }}>
                        <FontAwesome name="money" size={12} color="#d68c16" style={{ marginRight: 5 }} />
                        <Text style={{ fontSize: 12, color: "#d68c16" }}>{item.details.fare}</Text>
                      </View>
                    </View>

                    {/* Traffic Status Badge */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: `${trafficStatus(item.details.trafficLevel).color}15`,
                        alignSelf: "flex-start",
                      }}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: trafficStatus(item.details.trafficLevel).color,
                          marginRight: 5,
                        }}
                      />
                      <Text style={{ fontSize: 12, color: trafficStatus(item.details.trafficLevel).color, fontWeight: "500" }}>
                        {trafficStatus(item.details.trafficLevel).statusText}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
            style={{ maxHeight: height * 0.5 }}
          />
        </View>
      )}
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
