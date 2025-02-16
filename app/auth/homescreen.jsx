import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

const HomeScreen = ({ navigation }) => {
  // Replace Redux state with local state
  const [count, setCount] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); 
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isChoosingSource, setIsChoosingSource] = useState(false);
  const [isChoosingDestination, setIsChoosingDestination] = useState(false);

  const mapViewRef = useRef(null); // Reference for the MapView

  const initialRegion = {
    latitude: 14.5094,    
    longitude: 121.0348,  
    latitudeDelta: 1.00,  
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
      } else {
        setHasLocationPermission(false);
        Alert.alert('Permission Denied', 'You need to allow location permissions to use this feature.');
      }
    };

    requestLocationPermission();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query) {
      setIsDropdownVisible(true);
      const places = await getPlaces(query); // Assuming locationService handles fetching location data
      setLocations(places);
    } else {
      setIsDropdownVisible(false);
      setLocations([]);
    }
  };

  const handleLocationSelect = (place) => {
    setSearchQuery(place.description);
    setIsDropdownVisible(false);
    const selectedRegion = {
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };

    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(selectedRegion, 1000); // Smooth transition
    }

    setSelectedLocation({
      latitude: selectedRegion.latitude,
      longitude: selectedRegion.longitude,
    });
  };

  if (!hasLocationPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Waiting for location permission...</Text>
      </View>
    );
  }

  const showCoordinates = () => { 
    if (source && destination) {
    const distance = getDistance({
      latitude: source.latitude,
      longitude: source.longitude
    },{
      latitude: destination.latitude,
      longitude: destination.longitude
    },) / 1000;

    Alert.alert(
      "Coordinates and Distance",
      `Source: ${source.latitude}, ${source.longitude}
      \nDestination: ${destination.latitude}, ${destination.longitude}
      \nDistance: ${distance} km`,
    );
  } else {
    Alert.alert("Please select source and destination first");
  }
};

  const handleMapPress = (e) => {
    const coordinates = e.nativeEvent.coordinate;
    console.log(coordinates);
    if(isChoosingSource){
      setSource(coordinates);
      setIsChoosingSource(false);  
    }else if(isChoosingDestination){
      setDestination(coordinates);
      setIsChoosingDestination(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a location..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {isDropdownVisible && (
          <FlatList
            data={locations}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleLocationSelect(item)}>
                <Text style={styles.dropdownText}>{item.description}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.dropdown}
          />
        )}
      </View>

      <MapView
        ref={mapViewRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            description="This is the location you selected"
          />
        )}

        {source && (
          <Marker
          coordinate={source}
          title={"Source"}
          pinColor={'green'}
          draggable={true}
          onDragEnd={e=>setSource(e.nativeEvent.coordinate)}
          />
        )}

        {destination && (
          <Marker
          coordinate={destination}
          title={"Destination"}
          pinColor={'blue'}
          draggable={true}
          onDragEnd={e=>setDestination(e.nativeEvent.coordinate)}
          />
        )}  
        {source && destination && (
          <Polyline
          coordinates={[source, destination]}
          strokeColor="#000"
          strokewidth={2}
          />
        )}
      </MapView>
        
      <View style={styles.buttonContainer}>
        <View style={styles.buttonGroup}>
          {source?(
            <Button 
            title="Remove Source" 
            onPress={()=>setSource(null)} />
          ) : (
          <Button
            title={isChoosingSource?'Please Choose Source':"Choose Source"}
            onPress={() => setIsChoosingSource(true)}
          />
          )}
          {destination?(
            <Button 
            title="Remove Destination" 
            onPress={()=>setDestination(null)} />
          ) : (
          <Button
            title={isChoosingDestination?'Please Choose Destination':"Choose Destination"}
            onPress={() => setIsChoosingDestination(true)}
          />
          )}
          
        </View>
      </View>

      <Button title="Get Direction" onPress={showCoordinates}/>
      {/* This part must be replaced with the actual representation of getting direction from source to destination */}
      <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  searchBarContainer: { position: 'absolute', top: 10, left: 0, zIndex: 1, paddingHorizontal: 15 },
  searchBar: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 10, backgroundColor: 'white' },
  dropdown: { position: 'absolute', top: 40, left: 20, right: 20, backgroundColor: 'white', borderColor: 'gray', borderWidth: 2, borderRadius: 10, maxHeight: 50, zIndex: 5 },
  dropdownItem: { padding: 8 },
  dropdownText: { fontSize: 16 },
  map: { width: Dimensions.get('window').width, height: 450 },
  buttonContainer: { position: '', bottom: 20, left: 20, right: 20, paddingHorizontal: 15 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
});

export default HomeScreen;
