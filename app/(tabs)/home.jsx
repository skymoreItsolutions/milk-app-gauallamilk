import { ScrollView, StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, Animated, Easing } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Carousel from '../../components/home/Carousel';
import ExclusiveOffer from '../../components/home/ExclusiveOffer';
import BestSeller from '../../components/home/BestSeller';


const Home = () => {
  const [locationServiceEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setCurrentAddress] = useState("Fetching your location...");
  const [searchText, setSearchText] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;
  const cowPosition = useRef(new Animated.Value(-100)).current; 

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
    animateCowFall(); 
  }, []);

  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "Location Services not enabled",
        "Please enable your location service to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      setLocationServicesEnabled(true);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location Permission not granted",
        "Please grant your location permission to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const { coords } = location;
    const { latitude, longitude } = coords;

    const response = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });

    if (response.length > 0) {
      const address = response[0];
      const formattedAddress = `${address.name}, ${address.postalCode}, ${address.city}`;
      setCurrentAddress(formattedAddress);
    }
  };

  const animateCowFall = () => {
    Animated.timing(cowPosition, {
      toValue: 0,
      duration: 1200,
      easing: Easing.bounce, 
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.ScrollView 
      style={{ backgroundColor: 'white' }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true } 
      )}
      scrollEventThrottle={16}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.cowContainer, { transform: [{ translateY: cowPosition }] }]}>
          <FontAwesome6 name="cow" size={24} color="orange" />
        </Animated.View>

        <View style={styles.locationContainer}>
          <View style={styles.locationTextContainer}>
            <MaterialIcons name="location-on" size={24} color="gray" />
            <Text style={styles.addressText}>{displayCurrentAddress}</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here..."
            placeholderTextColor="gray"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <MaterialIcons name="close" size={24} color="#53B175" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>

        <Carousel />
        <ExclusiveOffer/>
        <BestSeller scrollY={scrollY} />
      </View>
      </Animated.ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  cowContainer: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  addressText: {
    color: 'gray',
    fontSize: 16,
    fontFamily: 'outfit',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 20,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  clearIcon: {
    marginLeft: 5,
  },
});
