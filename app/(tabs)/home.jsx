import { ScrollView, StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, Animated, Easing, Modal } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Carousel from '../../components/home/Carousel';
import ExclusiveOffer from '../../components/home/ExclusiveOffer';
import BestSeller from '../../components/home/BestSeller';
import {coldDrinks} from '../../data/coldDrinks'
import SearchFilter from '../../components/SearchFilter';
import { FadeIn } from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';


const Home = () => {
  const [locationServiceEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setCurrentAddress] = useState("Fetching your location...");
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const cowPosition = useRef(new Animated.Value(-100)).current; 
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
const [selectedPriceRange, setSelectedPriceRange] = useState(null);
const animatedWidth = useRef(new Animated.Value(1)).current;

useEffect(() => {
  console.log("Filtered Items:", filteredItems);
}, [filteredItems]);

useEffect(() => {
  Animated.timing(animatedWidth, {
    toValue: searchText.length > 0 ? 0.99 : 1,
    duration: 200,
    useNativeDriver: false,
  }).start();
}, [searchText]);


  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
    animateCowFall(); 
  }, []);

  useEffect(() => {
    if (searchText.trim().length === 0) {
      setFilteredItems([]);
    } else {
      const filtered = coldDrinks.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchText]);
  

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

  const renderSearchResults = () => (
    <Animated.FlatList
      data={filteredItems}
      style={{ marginBottom: 50 }}
      keyExtractor={(item) => item.name}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeIn.delay(index * 100)}>
          <SearchFilter key={index} item={item} />
        </Animated.View>
      )}
    />
  );
  

  return (<>
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

        <View style={styles.searchWrapper}>
  <Animated.View style={[styles.searchBar, { flex: animatedWidth }]}>
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
  </Animated.View>

  {searchText.length > 0 && (
    <TouchableOpacity
      style={styles.filterIcon}
      onPress={() => setFilterModalVisible(true)}
    >
      <AntDesign name="filter" size={24} color="black" />
    </TouchableOpacity>
  )}
</View>



          {
            searchText?(
              renderSearchResults()
            ):(
              <>
              <Carousel />
              <ExclusiveOffer/>
              <BestSeller scrollY={scrollY} />
              </>
            )
          }
       
      </View>
      </Animated.ScrollView>

      <Modal
  visible={isFilterModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setFilterModalVisible(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPressOut={() => setFilterModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Filters</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Categories</Text>
        {['Soft Drink', 'Juice', 'Energy Drink'].map((category) => (
          <TouchableOpacity
            key={category}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            onPress={() => {
              if (selectedCategories.includes(category)) {
                setSelectedCategories(selectedCategories.filter(c => c !== category));
              } else {
                setSelectedCategories([...selectedCategories, category]);
              }
            }}
          >
            <MaterialIcons
              name={selectedCategories.includes(category) ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color="#53B175"
            />
            <Text style={{ marginLeft: 10 }}>{category}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Price</Text>
        {[
          { label: 'Below ₹50', value: 'below50' },
          { label: '₹50 - ₹100', value: '50to100' },
          { label: 'Above ₹100', value: 'above100' }
        ].map(({ label, value }) => (
          <TouchableOpacity
            key={value}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            onPress={() => setSelectedPriceRange(value)}
          >
            <MaterialIcons
              name={selectedPriceRange === value ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={24}
              color="#53B175"
            />
            <Text style={{ marginLeft: 10 }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fixedApplyBtn}
        onPress={() => {
          const filtered = coldDrinks.filter(item => {
            const matchesCategory =
              selectedCategories.length === 0 || selectedCategories.includes(item.category);
            const matchesPrice = (() => {
              if (!selectedPriceRange) return true;
              if (selectedPriceRange === 'below50') return item.price < 50;
              if (selectedPriceRange === '50to100') return item.price >= 50 && item.price <= 100;
              if (selectedPriceRange === 'above100') return item.price > 100;
              return true;
            })();
            return matchesCategory && matchesPrice;
          });

          setFilteredItems(filtered);
          setFilterModalVisible(false);
        }}
      >
        <Text style={styles.applyBtnText}>Apply Filter</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>

</>
      
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  
  filterIcon: {
    marginLeft: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 10,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  
  modalContainer: {
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight:600
  },
  
  applyBtn: {
    backgroundColor: '#53B175',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  
  applyBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fixedApplyBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#53B175',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  
  
  
});
