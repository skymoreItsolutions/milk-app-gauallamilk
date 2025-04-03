import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Animated } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import ExclusiveItems from '../../data/ExclusiveItems';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from "../../redux/CartReducer";

const ExclusiveOffer = () => {
    const animatedValues = useRef({});
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const increaseQuantity = (item) => {
        dispatch(incrementQuantity(item));
    };
    
    const decreaseQuantity = (item) => {
        const cartItem = cart.find((cartItem) => cartItem.id === item.id);
        if (cartItem && cartItem.quantity === 1) {
            dispatch(removeFromCart(item));
        } else {
            dispatch(decrementQuantity(item));
        }
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>Exclusive Offer</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>

            <Animated.View style={{ opacity: fadeAnim }}>
                <FlatList
                    data={ExclusiveItems}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const cartItem = cart.find((cartItem) => cartItem.id === item.id);
                        const quantity = cartItem ? cartItem.quantity : 0;

                        return (
                            <TouchableOpacity style={styles.card}>
                                <Image source={{ uri: item.image }} style={styles.productImage} />

                                <View style={styles.nameContainer}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productQuantity}>{item.size}</Text>
                                </View>

                                <View style={styles.flexSpacer} />

                                <View style={styles.priceContainer}>
                                    <View style={styles.priceWrapper}>
                                        <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
                                    </View>
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
                                        <Text style={styles.quantityText}>{quantity}</Text>
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
                            </TouchableOpacity>
                        );
                    }}
                />
            </Animated.View>
        </View>
    );
};

export default ExclusiveOffer;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    headerContainer: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    seeAllText: {
        color: 'green',
        fontSize: 16,
    },
    card: {
        borderWidth: 1,
        borderColor: '#E2E2E2',
        padding: 10,
        marginRight: 10,
        borderRadius: 10,
        width: 160,
        justifyContent: 'flex-start',
    },
    productImage: {
        width: 130,
        height: 120,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    nameContainer: {
        alignItems: 'flex-start',
        marginTop: 5,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    productQuantity: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    flexSpacer: {
        flex: 1,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#53B175',
        marginLeft: 3,
    },
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
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
