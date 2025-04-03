import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { cleanCart, decrementQuantity, incrementQuantity, removeFromCart } from "../../redux/CartReducer";

const cartItems = [
  { id: "1", name: "Bread", size: "1kg", price: 4.99, image: "https://png.pngtree.com/png-clipart/20250308/original/pngtree-3d-white-bread-transparent-background-png-image_20602424.png", quantity: 1 },
  { id: "2", name: "Egg Chicken Red", size: "4pcs", price: 1.99, image: "https://cdn-icons-png.flaticon.com/128/1864/1864457.png", quantity: 1 },
  { id: "3", name: "Organic Bananas", size: "12kg", price: 3.00, image: "https://cdn-icons-png.flaticon.com/128/415/415682.png", quantity: 1 },
  { id: "4", name: "Ginger", size: "250gm", price: 2.99, image: "https://cdn-icons-png.flaticon.com/128/2909/2909771.png", quantity: 1 },
];

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const animatedValues = useRef(cart.map(() => new Animated.Value(300))).current; 
  const dispatch = useDispatch();
  
  useEffect(() => {
    cart.forEach((item, index) => {
      if (animatedValues[index]._value === 300) {  
        Animated.timing(animatedValues[index], {
          toValue: 0,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [cart]); 

  
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Cart</Text>
      <View style={styles.divider} />
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View 
            style={[
              styles.itemContainer, 
              { transform: [{ translateX: animatedValues[index] }] }
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSize}>{item.size}</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() =>  dispatch(decrementQuantity(item))} style={styles.quantityButton}>
                  <Text style={styles.quantityTexts}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{item.quantity}</Text>
                <TouchableOpacity onPress={() =>  dispatch(incrementQuantity(item))} style={styles.quantityButton}>
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemAction}>
              <TouchableOpacity onPress={() => dispatch(removeFromCart(item))}>
                <Ionicons name="close" size={20} color="gray" />
              </TouchableOpacity>
              <Text style={styles.itemPrice}>₹ {(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </Animated.View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.buttonText}>Go to Checkout </Text>
          <Text style={styles.price}>₹ {totalPrice}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    justifyContent: "space-between",
  },
  itemImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemSize: {
    fontSize: 14,
    color: "gray",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  quantityButton: {
    borderColor: "#EAEAEA",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  quantityTexts: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    backgroundColor: "white",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    backgroundColor: "white",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  itemAction: {
    alignItems: "flex-end",
    gap: 20,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  footer: {
    position: "absolute",
    bottom: 55,
    left: 20,
    right: 20,
  },
  checkoutButton: {
    backgroundColor: "#53B175",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    backgroundColor: "#489E67",
    padding: 5,
    color: "white",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
});
