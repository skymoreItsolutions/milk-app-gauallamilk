import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, incrementQuantity, removeFromCart } from "../../redux/CartReducer";

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const animatedValues = useRef(cart.map(() => new Animated.Value(300))).current; 
  const emptyCartOpacity = useRef(new Animated.Value(0)).current; 
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (cart.length === 0) {
      Animated.timing(emptyCartOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }

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

      {cart.length === 0 ? (
        <Animated.View style={[styles.emptyCartContainer, { opacity: emptyCartOpacity }]}>
          <Image 
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2038/2038854.png" }} 
            style={styles.emptyCartImage} 
          />
          <Text style={styles.emptyCartText}>Your cart is empty!</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
      )}

      {cart.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.buttonText}>Go to Checkout </Text>
            <Text style={styles.price}>₹ {totalPrice}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
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
