import { View, TextInput, TouchableOpacity, Text, Image, FlatList, Dimensions, Alert, Button } from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { PanResponder } from "react-native";
import * as Location from "expo-location"; // Importing Expo Location
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from '@env';

console.log("Loaded API Key:", GOOGLE_MAPS_API_KEY);

const { width, height } = Dimensions.get("window");

const Main = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [destinationQuery, setDestinationQuery] = useState(""); 
  const [destination, setDestination] = useState([]);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [searchBoxHeight, setSearchBoxHeight] = useState(height * 0.30); 
  const mapRef = React.useRef(null); // Create reference for MapView


  // Get real-time location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Request permission to access location
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to use this feature.");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Get high-accuracy location
      });
      setLocation(userLocation.coords); // Save the real-time location coordinates
    })();
  }, []);

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
            const validPlaces = response.data.predictions.filter(place => place.place_id);

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
  
        const validPlaces = response.data.predictions.filter((place) => place.place_id);
  
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

    } catch (error) {
        console.error("Error fetching destination details:", error);
        Alert.alert("Error", "Failed to retrieve destination details.");
    }
};

  
  const calculateFare = () => {
    if (selectedLocation && destinationLocation) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${selectedLocation.latitude},${selectedLocation.longitude}&destinations=${destinationLocation.latitude},${destinationLocation.longitude}&key=AIzaSyA97iQhpD5yGyKeHxmPOkGMTM7cqmGcuS8`
        )
        .then((response) => {
          const distance = response.data.rows[0].elements[0].distance.value; // Distance in meters
          const fare = calculateFareFromDistance(distance);
          console.log("Calculated Fare:", fare);
          Alert.alert("Fare Estimate", `Estimated Fare: PHP ${fare.toFixed(2)}`);
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Error", "Failed to calculate fare.");
        });
    } else {
      Alert.alert("Error", "Please select a source and destination.");
    }
  };
  
  
  
  const calculateFareFromDistance = (distance) => {
    const ratePerKm = 10; // Example rate per kilometer
    const distanceInKm = distance / 1000; // Convert meters to kilometers
    return ratePerKm * distanceInKm; // Calculate fare
  };
  
  

  // Handle pan gesture for sliding effect
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const { dy } = gestureState;

      // Define the boundaries (15% to 75% of screen height)
      let newHeight = searchBoxHeight - dy;
      if (newHeight < height * 0.15) newHeight = height * 0.15; // Prevent going below 15%
      if (newHeight > height * 0.75) newHeight = height * 0.75; // Prevent going above 75%
      setSearchBoxHeight(newHeight); // Update search box height
    },
    onPanResponderRelease: () => {},
  });

  // Focus map on current location
  const focusOnLocation = () => {
    if (location && mapRef.current) {
        mapRef.current.animateToRegion(
            {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.050,
                longitudeDelta: 0.050,
            },
            1000 // The animation duration in milliseconds (1000 = 1 second)
        );
    }
  };


  

  return (
    <View className="flex-1">
      {/* Map Background */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: width, height: height - searchBoxHeight }}
        ref={mapRef} // Reference for animation
        initialRegion={{
          latitude: 14.5995, // Metro Manila's latitude
          longitude: 120.9842, // Metro Manila's longitude
          latitudeDelta: 0.1, // Adjust to zoom level
          longitudeDelta: 0.1, // Adjust to zoom level
        }}
        showsUserLocation={true} // Show the user's location on the map
      >

        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title={selectedLocation.name}
            description={selectedLocation.address}
          />
        )}

        {destinationLocation && (
          <Marker
            coordinate={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            title={destinationLocation.name}
            description={destinationLocation.address}
            pinColor="green"
          />
        )}

{places.map((place, index) => (
    place.geometry && place.geometry.location ? ( // Ensure geometry exists
        <Marker
            key={index}
            coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
            }}
            title={place.name}
            description={place.formatted_address}
        />
    ) : null
))}


      </MapView>


      {/* Bottom Search Section */}
      <View
        className="absolute bottom-0 w-full bg-[#4E5D6C] rounded-t-3xl p-6"
        style={{ height: searchBoxHeight }}
        {...panResponder.panHandlers} // Enable sliding effect
      >
        {/* Draggable Indicator (Line) */}
        <View style={{ alignSelf: "center", width: 40, height: 5, backgroundColor: "white", borderRadius: 5, marginBottom: 10 }} />

        {/* Search Bar */}
        <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full shadow-md mb-4">
          <FontAwesome name="search" size={20} color="#4E5D6C" />
          <TextInput
            placeholder="Search for places"
            placeholderTextColor="#4E5D6C"
            value={searchQuery || ""}  // Ensure it's never null
            onChangeText={(text) => handleSearch(text)}
            style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
          />
        </View>

        {/* Display Start Search Results */}
        {places.length > 0 && (
          <FlatList
          data={places}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectPlace(item)} style={{ paddingVertical: 10 }}>
              <Text className="text-white text-sm">{item.description}</Text>
            </TouchableOpacity>
          )}
            style={{ maxHeight: 150, marginBottom: 10 }}
          />
        )}

        {/* Destination Search Bar */}
        <View className="w-full bg-white flex-row items-center px-4 py-3 rounded-full shadow-md mb-4">
          <FontAwesome name="search" size={20} color="#4E5D6C" />
          <TextInput
            placeholder="Search for destination"
            placeholderTextColor="#4E5D6C"
            value={destinationQuery || ""}
            onChangeText={(text) => handleDestinationSearch(text)}
            style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
          />
        </View>

        {/* Display Destination Search Results */}
        {places.length > 0 && (
          <FlatList
            data={places}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectDestination(item)} style={{ paddingVertical: 10 }}>
                <Text className="text-white text-sm">{item.description}</Text>
              </TouchableOpacity>
            )}
              style={{ maxHeight: 150, marginBottom: 10 }}
          />
        )}


        {/* Display Selected Location Details */}
        {selectedLocation && (
          <View>
            <Text className="text-white text-lg font-bold">{selectedLocation.name}</Text>
            <Text className="text-green-400 text-sm font-semibold">{selectedLocation.status}</Text>
            <Text className="text-white text-sm">{selectedLocation.address}</Text>
          </View>
        )}
      </View>

      <Button title="Calculate Fare" onPress={calculateFare} />

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
        }}
        onPress={focusOnLocation}
      >
        <FontAwesome6 name="location-crosshairs" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Main;
