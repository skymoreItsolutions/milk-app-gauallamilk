import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const menuItems = [
  { title: "Orders", icon: "shopping-bag" },
  { title: "My Details", icon: "person" },
  { title: "Delivery Address", icon: "location-on" },
  { title: "Payment Methods", icon: "credit-card" },
  { title: "Promo Code", icon: "local-offer" },
  { title: "Notifications", icon: "notifications" },
  { title: "Help", icon: "help-outline" },
  { title: "About", icon: "info" },
];

const Account = () => {
  return (
    <View style={styles.container}>
      
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: "https://i.redd.it/pm4n5rvu91dc1.jpeg" }} 
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>Franklin Clinton</Text>
            <TouchableOpacity>
              <MaterialIcons name="edit" size={17} color="green" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userEmail}>Franklin@gmail.com</Text>
        </View>
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => <AnimatedMenuItem item={item} index={index} />}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color="green" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AnimatedMenuItem = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <TouchableOpacity onPress={() => console.log(`${item.title} pressed`)} activeOpacity={0.6}>
    <Animated.View style={[styles.menuItem, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.menuItemLeft}>
        <MaterialIcons name={item.icon} size={22} color="gray" />
        <Text style={styles.menuText}>{item.title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color="black" />
    </Animated.View>
    </TouchableOpacity>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileContainer: {
    flexDirection: "row", 
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  profileImage: {
    width: 60, 
    height: 60, 
    borderRadius: 20, 
    marginRight: 15,
  },
  userInfo: {
    justifyContent: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  userEmail: {
    fontSize: 14,
    color: "gray",
  },
  listContainer: {
    paddingBottom: 100, 
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  menuText: {
    fontSize: 17,
    color: "black",
    fontWeight: '600'
  },
  logoutContainer: {
    width: "100%",
    padding: 15,
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    backgroundColor: "white",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "90%",
    backgroundColor: "#F2F3F2",
    borderRadius: 15,
  },
  logoutText: {
    fontSize: 16,
    color: "green",
    marginLeft: 8,
  },
});
