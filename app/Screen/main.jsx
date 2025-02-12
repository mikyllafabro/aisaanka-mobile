import { View, TextInput, TouchableOpacity, Text, Image, FlatList, Dimensions } from "react-native";
import React, { useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { FontAwesome } from "@expo/vector-icons";
import { PanResponder } from "react-native";

const { width, height } = Dimensions.get("window");

const Main = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchBoxHeight, setSearchBoxHeight] = useState(height * 0.30); // Initial height for the search box
  
  // Example Data (Replace with API data in the future)
  const locations = [
    {
      id: 1,
      name: "Technological University of the Philippines (TUP) - Manila",
      status: "Open",
      address: "Ayala Blvd, Manila",
      latitude: 14.5869,
      longitude: 120.9833,
      photos: [
        require("../../assets/images/14.png"),
        require("../../assets/images/15.png"),
        require("../../assets/images/13.png"),
      ],
      openingHours: [
        { day: "Monday", time: "8:00 am - 5:00 pm" },
        { day: "Tuesday", time: "8:00 am - 5:00 pm" },
        { day: "Wednesday", time: "8:00 am - 5:00 pm" },
      ],
    },
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
    const foundLocation = locations.find((loc) =>
      loc.name.toLowerCase().includes(text.toLowerCase())
    );
    setSelectedLocation(foundLocation || null);
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

  return (
    <View className="flex-1">
      {/* Map Background */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: width, height: height - searchBoxHeight }} // Adjust map height dynamically based on search box height
        initialRegion={{
          latitude: 14.5995,
          longitude: 120.9842,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {selectedLocation && (
          <Marker coordinate={{ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }} />
        )}
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
            placeholder="Where are you going?"
            placeholderTextColor="#4E5D6C"
            value={searchQuery}
            onChangeText={handleSearch}
            style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
          />
        </View>

        {/* Display Selected Location Details */}
        {selectedLocation && (
          <View>
            <Text className="text-white text-lg font-bold">{selectedLocation.name}</Text>
            <Text className="text-green-400 text-sm font-semibold">{selectedLocation.status}</Text>
            <Text className="text-white text-sm">{selectedLocation.address}</Text>

            {/* Photos */}
            <Text className="text-white text-lg font-bold mt-4">Photos</Text>
            <FlatList
              horizontal
              data={selectedLocation.photos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={item}
                  style={{ width: 150, height: 150, borderRadius: 10, marginRight: 16 }} // Increased size
                />
              )}
            />

            {/* Opening Hours */}
            <Text className="text-white text-lg font-bold mt-4">Opening hours</Text>
            {selectedLocation.openingHours.map((hour, index) => (
              <Text key={index} className="text-white text-sm">
                {hour.day} - {hour.time}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default Main;
