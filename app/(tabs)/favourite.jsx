import React, { useRef, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, cleanCart } from "../../redux/CartReducer";
import { cleanWishlist } from "../../redux/WishListReducer";
import { useRouter } from "expo-router";

const favouriteItems = [
  { id: "1", name: "Sprite Can", size: "325ml", price: "$1.50", image: "https://cdn-icons-png.flaticon.com/128/8055/8055260.png" },
  { id: "2", name: "Diet Coke", size: "355ml", price: "$1.99", image: "https://cdn-icons-png.flaticon.com/128/8055/8055241.png" },
  { id: "3", name: "Apple & Grape Juice", size: "2L", price: "$15.50", image: "https://cdn-icons-png.flaticon.com/128/2921/2921822.png" },
  { id: "4", name: "Coca Cola Can", size: "325ml", price: "$4.99", image: "https://cdn-icons-png.flaticon.com/128/8055/8055248.png" },
  { id: "5", name: "Pepsi Can", size: "330ml", price: "$4.99", image: "https://cdn-icons-png.flaticon.com/128/8055/8055256.png" },
];

const Favourite = () => {
  const fadeAnimations = useRef(favouriteItems.map(() => new Animated.Value(0))).current;
  const router = useRouter();
  useEffect(() => {
    fadeAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  console.log('wiwiwi',wishlist);

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => {
      dispatch(addToCart({ ...item, quantity: 1 }));
      dispatch(cleanWishlist())
      router.push('/cart')
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favourite</Text>

      {wishlist.length === 0 ? (
  <View style={styles.emptyContainer}>
    <Ionicons name="heart-dislike-outline" size={80} color="#ccc" />
    <Text style={styles.emptyText}>Your wishlist is empty</Text>
  </View>
) : (
  <>
    <FlatList
      data={wishlist}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <Animated.View style={{ opacity: fadeAnimations[index] || 1 }}>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              router.push({
                pathname: "/Productdetails",
                params: {
                  id: item.id,
                  name: item.name,
                  image: item.image,
                  price: item.price,
                  review: item.review,
                  nutrients: JSON.stringify(item.nutrients),
                  productDetails: item.productDetails,
                  size: item.size,
                },
              })
            }
          >
            <Image source={ item.image } style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSize}>{item.size}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <Ionicons name="chevron-forward" size={18} color="black" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
    />

    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddAllToCart}>
      <Text style={styles.buttonText}>Add All To Cart</Text>
    </TouchableOpacity>
  </>
)}

    </View>
  );
};

export default Favourite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
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
    width: 50,
    height: 50,
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
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addToCartButton: {
    position: "absolute",
    bottom: 55,
    left: 20,
    right: 20,
    backgroundColor: "#53B175",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
