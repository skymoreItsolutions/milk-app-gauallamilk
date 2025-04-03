import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Platform } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const categories = [
  { id: 1, title: "Milk & Flavored Milk", image: "https://png.pngtree.com/png-vector/20241002/ourmid/pngtree-chocolate-milk-drinks-isolated-on-white-transparent-background-png-image_13998533.png", bgColor: "#FFFDF0", borderColor: "#FFD966" },
  { id: 2, title: "Curd & Yogurt", image: "https://png.pngtree.com/png-vector/20240923/ourmid/pngtree-greek-yogurt-isolated-on-white-transparent-background-png-image_13886118.png", bgColor: "#F0FFF0", borderColor: "#77DD77" },
  { id: 3, title: "Paneer & Cheese", image: "https://png.pngtree.com/png-clipart/20240907/original/pngtree-paneer-cheese-cubes-on-a-plate-transparent-background-png-image_15958435.png", bgColor: "#F5F5FF", borderColor: "#6A5ACD" },
  { id: 4, title: "Ghee & Butter", image: "https://png.pngtree.com/png-vector/20240624/ourmid/pngtree-ghee-clarified-butter-jar-wooden-spoon-gray-table-top-view-copyspace-png-image_12827736.png", bgColor: "#FFF5E6", borderColor: "#FFCC80" },
  { id: 5, title: "Ice Cream & Desserts", image: "https://png.pngtree.com/png-clipart/20230411/original/pngtree-ice-cream-dessert-realistic-white-background-transparent-png-image_9047252.png", bgColor: "#FFF0F5", borderColor: "#FFB6C1" },
  { id: 6, title: "Milk Powder & Cream", image: "https://png.pngtree.com/png-clipart/20240828/original/pngtree-3d-whole-milk-powder-on-transparent-background-png-image_15874830.png", bgColor: "#F0F8FF", borderColor: "#87CEEB" },
  { id: 7, title: "Chocolate Milk", image: "https://png.pngtree.com/png-clipart/20240718/original/pngtree-chocolate-milkshake-white-transparent-background-png-image_15582721.png", bgColor: "#FFF3E0", borderColor: "#D2691E" },
  { id: 8, title: "Lassi & Buttermilk", image: "https://png.pngtree.com/png-vector/20241002/ourmid/pngtree-a-glass-of-lassi-isolated-on-white-transparent-background-png-image_13998579.png", bgColor: "#E6F7FF", borderColor: "#4682B4" },
];

const Explore = () => {
  const [searchText, setSearchText] = useState("");
  const [reload, setReload] = useState(0);


  useFocusEffect(
    useCallback(() => {
      setReload(prev => prev + 1); 
    }, [])
  );

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Dairy Products</Text>
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

      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        {categories.map((item, index) => (
          <AnimatedCard key={`${reload}-${item.id}`} item={item} index={index} />
        ))}
      </ScrollView>
    </View>
  );
};

const AnimatedCard = ({ item, index }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 + index * 100 });
    translateY.value = withTiming(0, { duration: 500 + index * 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <TouchableOpacity 
      onPress={() => console.log(`Selected: ${item.title}`)} 
      style={{ width: '47%', marginBottom: 15 }}  
    >
      <Animated.View style={[styles.card, animatedStyle, { backgroundColor: item.bgColor, borderColor: item.borderColor }]}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <Text style={styles.cardText}>{item.title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: Platform.OS === "ios" ?50:60
  },
  card: {
    width: '100%',  
    aspectRatio: 1.1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,  
  },
  cardImage: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
