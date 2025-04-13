import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  cleanCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../../redux/CartReducer";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [simulateSuccess, setSimulateSuccess] = useState(true);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const router = useRouter();
  const emptyAnim = useRef(new Animated.Value(0)).current;
  const quantityAnimRefs = useRef({});
  console.log('cart',cart)
  
  useEffect(() => {
    cart.forEach((item) => {
      if (!quantityAnimRefs.current[item.id]) {
        quantityAnimRefs.current[item.id] = new Animated.Value(1);
      }
    });
  }, [cart]);
  const triggerQuantityAnim = (id) => {
    const anim = quantityAnimRefs.current[id];
    anim.setValue(0.8);
    Animated.spring(anim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };
  
  

useEffect(() => {
  if (cart.length === 0) {
    Animated.timing(emptyAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }
}, [cart]);


  const successFadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimRefs = useRef([]);

  useEffect(() => {
    fadeAnimRefs.current = cart.map(() => new Animated.Value(0));
    
    fadeAnimRefs.current.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 250,
        useNativeDriver: true,
      }).start();
    });
  }, [cart.length]);
  
  

  useEffect(() => {
    if (showSuccessModal) {
      successFadeAnim.setValue(0);
      Animated.timing(successFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showSuccessModal]);

  const totalPrice = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
      </View>
      <View style={styles.divider} />

      {cart.length === 0 ? (
        <Animated.View
        style={[
          styles.emptyCartContainer,
          {
            opacity: emptyAnim,
            transform: [
              {
                translateY: emptyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2038/2038854.png",
            }}
            style={styles.emptyCartImage}
          />
          <Text style={styles.emptyCartText}>Your cart is empty!</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <Animated.View
  style={{
    opacity: fadeAnimRefs.current[index] || 1,
    transform: [
      {
        translateY:
          fadeAnimRefs.current[index]?.interpolate({
            inputRange: [0, 1],
            outputRange: [15, 0],
          }) || 0,
      },
      {
        scale:
          fadeAnimRefs.current[index]?.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }) || 1,
      },
    ],
  }}
>

              <View style={styles.itemContainer}>
                <Image source={ item.image } style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSize}>{item.size}</Text>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                     onPress={() => {
                      dispatch(decrementQuantity(item));
                      triggerQuantityAnim(item.id);
                    }}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityTexts}>-</Text>
                    </TouchableOpacity>
                    <Animated.Text
                        style={[
                          styles.quantityValue,
                          {
                            transform: [
                              {
                                scale:
                                  quantityAnimRefs.current[item.id] || new Animated.Value(1),
                              },
                            ],
                          },
                        ]}
                      >
                        {item.quantity}
                      </Animated.Text>

                    <TouchableOpacity
                     onPress={() => {
                      dispatch(incrementQuantity(item));
                      triggerQuantityAnim(item.id);
                    }}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.itemAction}>
                  <TouchableOpacity
                    onPress={() => dispatch(removeFromCart(item))}
                  >
                    <Ionicons name="close" size={20} color="gray" />
                  </TouchableOpacity>
                  <Text style={styles.itemPrice}>
                    ₹ {(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => setShowCheckoutModal(true)}
          >
            <Text style={styles.buttonText}>Go to Checkout </Text>
            <Text style={styles.price}>₹ {totalPrice}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Checkout Modal */}
      <Modal
        visible={showCheckoutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCheckoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.checkoutModal}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.checkoutTitle}>CheckOut</Text>
              <TouchableOpacity
                onPress={() => setShowCheckoutModal(false)}
                style={{ marginBottom: 20 }}
              >
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />
            <TouchableOpacity style={styles.optionButton}>
              <Text style={{ color: "gray", fontSize: 17, fontWeight: 600 }}>
                Delivery
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Text style={styles.optionText}>Select Method</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
              <Text style={{ color: "gray", fontSize: 17, fontWeight: 600 }}>
                Payment
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <FontAwesome name="credit-card" size={24} color="black" />
                <AntDesign name="right" size={15} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
              <Text style={{ color: "gray", fontSize: 17, fontWeight: 600 }}>
                Promo Code
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Text style={styles.optionText}>Pick Discount</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
              <Text style={{ color: "gray", fontSize: 17, fontWeight: 600 }}>
                Total Cost
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Text style={styles.optionText}>₹ {totalPrice}</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
            </TouchableOpacity>

            <Text style={{ color: "gray", fontSize: 14 }}>
              By placing an order you agree to our{" "}
              <Text style={{ fontWeight: "bold", color: "black" }}>
                Terms and Conditions
              </Text>
            </Text>

            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={() => {
                setShowCheckoutModal(false);
              
                setTimeout(() => {
                  if (simulateSuccess) {
                    setShowSuccessModal(true);
                    dispatch(cleanCart());
                  } else {
                    setShowFailureModal(true);
                  }
                }, 300);
              }}
              
            >
              <FontAwesome
                name="shopping-bag"
                size={18}
                color="white"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.successContainer}>
          <Image
            source={require("../../assets/images/confirm.gif")}
            style={styles.successImage}
          />
          <Text style={styles.successTitle}>Your Order has been accepted</Text>
          <Text style={styles.successSubtitle}>
            Your item has been placed and is on it's way to being processed
          </Text>

          <View style={styles.successButtonRow}>
            <TouchableOpacity
              style={styles.successBtnOutline}
              onPress={() => {
                router.replace("/account");
                setShowSuccessModal(false);
              }}
            >
              <Text
                style={{
                  color: "#53B175",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Track Order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.successBtnFilled}
              onPress={() => {
                router.replace("/home");
                setShowSuccessModal(false);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
  visible={showFailureModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowFailureModal(false)}
>
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)", 
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        backgroundColor: "#eff1f3",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        width: "80%",
      }}
    >
      <Image
        source={require("../../assets/images/fail.gif")}
        style={{
          width: 120,
          height: 120,
          marginBottom: 16,
        }}
        resizeMode="cover"
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "#d9534f",
          marginBottom: 8,
        }}
      >
        Order Failed
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#555",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Something went wrong while placing your order. Please try again.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#d9534f",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
        }}
        onPress={() => setShowFailureModal(false)}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Try Again</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginBottom: 10,
    marginTop:10
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  checkoutModal: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#EAEAEA",
    
    marginBottom: 10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  optionText: {
    fontSize: 16,
    fontWeight:600
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    alignItems: "center",
  },
  cancelText: {
    color: "red",
    fontWeight: "bold",
  },
  placeOrderButton: {
    backgroundColor: "#53B175",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  
  placeOrderText: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successImage: {
    width: 220,
    height: 220,
    marginBottom: 20,
    resizeMode:'cover'
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#53B175',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 40,
  },
  successButtonRow: {
    width: '100%',
    gap: 15,
  },
  successBtnOutline: {
    borderWidth: 1.5,
    borderColor: '#53B175',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
  },
  successBtnFilled: {
    backgroundColor: '#53B175',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
  },
  failureContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  failureImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  failureTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff4d4d",
    marginBottom: 10,
  },
  failureSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  
});
