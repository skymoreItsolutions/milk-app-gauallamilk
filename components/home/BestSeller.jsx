import { StyleSheet, Text, TouchableOpacity, View, Animated, Image, Platform } from "react-native";
import React, { useRef } from "react";
import data from "../../data/ExclusiveItems";
import { FontAwesome } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from "../../redux/CartReducer";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";

const BestSeller = ({ scrollY }) => {
    const animatedValues = useRef({});
    const router = useRouter();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);

    const filteredData = Array.isArray(data) 
        ? data.filter((item) => item.id <= 10 && item.id >= 1).sort((a, b) => b.id - a.id) 
        : [];

    const getItemQuantity = (itemId) => {
        const cartItem = cart.find((cartItem) => cartItem.id.toString() === itemId.toString());
        return cartItem ? cartItem.quantity : 0;
    };

    const animateQuantity = (id, direction) => {
        if (!animatedValues.current[id]) {
            animatedValues.current[id] = new Animated.Value(0); 
        }

        animatedValues.current[id].setValue(direction === 'up' ? 20 : -20);

        Animated.timing(animatedValues.current[id], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const increaseQuantity = (item) => {
        dispatch(incrementQuantity(item));
        animateQuantity(item.id, 'up');
    };

    const decreaseQuantity = (item) => {
        const cartItem = cart.find((cartItem) => cartItem.id === item.id);
        if (cartItem && cartItem.quantity === 1) {
            dispatch(removeFromCart(item));
        } else {
            dispatch(decrementQuantity(item));
            animateQuantity(item.id, 'down');
        }
    };

    const renderItem = ({ item, index }) => {
        const quantity = getItemQuantity(item.id);

        const inputRange = [-1, 0, index * 180, (index + 1) * 180];

        const translateY = scrollY.interpolate({
            inputRange,
            outputRange: [80, 40, 0, -5],
            extrapolate: "clamp",
        });

        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.85, 0.95, 1, 1.02],
            extrapolate: "clamp",
        });

        const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0, 0.3, 1, 1],
            extrapolate: "clamp",
        });

        return (
            <TouchableOpacity
                style={styles.cardWrapper} 
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/Productdetails', params: { 
                    id: item.id.toString(),
                    name: item.name,
                    image: item.image,
                    price: item.price.toString(),
                    review: item.review.toString(),
                    nutrients: JSON.stringify(item.nutrients),
                    productDetails: item.productDetails,
                    size: item.size,
                }})}
            >
                <Animated.View style={[styles.card, { opacity, transform: [{ translateY }, { scale }] }]}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                        <Text style={styles.cardQuantity}>{item.size}</Text>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.price}>₹{item.price}</Text>
                        <View style={styles.reviewContainer}>
                            <FontAwesome name="star" size={14} color="#FFD700" />
                            <Text style={styles.reviewText}>{item.review}</Text>
                        </View>
                    </View>

                    {quantity > 0 ? (
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => decreaseQuantity(item)} style={styles.quantityButton}>
                                <Text style={styles.quantityText}>-</Text>
                            </TouchableOpacity>

                            <View style={styles.quantityWrapper}>
                                <Animated.Text
                                    style={[
                                        styles.quantityText,
                                        {
                                            transform: [
                                                { translateY: animatedValues.current[item.id] || new Animated.Value(0) },
                                            ],
                                        },
                                    ]}
                                >
                                    {quantity}
                                </Animated.Text>
                            </View>

                            <TouchableOpacity onPress={() => increaseQuantity(item)} style={styles.quantityButton}>
                                <Text style={styles.quantityText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                dispatch(addToCart(item));
                            }}
                        >
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>Best Seller</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>

            <Animated.FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} 
                columnWrapperStyle={styles.row} 
                scrollEnabled={false} 
                extraData={scrollY}
            />
        </View>
    );
};

export default BestSeller;


const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    row: {
        justifyContent: "space-between",  
    },
    cardWrapper: {
        flex: 1, 
        margin: 5,
        paddingBottom:20
    },
    headerContainer: {
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleText: {
        fontSize: 22,
        fontWeight: "bold",
    },
    seeAllText: {
        color: 'green',
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 3,
    },
    row: {
        justifyContent: "space-between",
    },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 5,
        margin: 5,
        borderRadius: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 130,
        height: 120,
        resizeMode: 'contain',
    },
    textContainer: {
        minHeight: 50,
        justifyContent: "center",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        minHeight: 40,
    },
    cardQuantity: {
        color: "gray",
        marginTop: 3,
        marginBottom: 7,
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    price: {
        fontSize: 14,
        color: "green",
        fontWeight: "bold",
    },
    reviewContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    reviewText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#666",
        marginLeft: 3,
    },
    addToCartButton: {
        backgroundColor: '#53B175',
        borderRadius: 12,
        height: 35,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    addToCartText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
    quantityContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 12,
        height: 35,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginTop: 8,
        backgroundColor: '#E8F5E9',
    },
    quantityButton: {
        backgroundColor: '#A5D6A7',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    quantityText: {
        color: 'green',
        fontSize: 16,
        fontWeight: '600',
    },
    quantityWrapper: {
        height: 20,
        overflow: 'hidden',
    },
});
