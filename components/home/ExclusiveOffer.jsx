import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Animated } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import ExclusiveItems from '../../data/ExclusiveItems';
import * as Haptics from 'expo-haptics';

const ExclusiveOffer = () => {
    const [quantities, setQuantities] = useState({});
    const animatedValues = useRef({});
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

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

    const increaseQuantity = (id) => {
        setQuantities((prev) => {
            const newQty = (prev[id] || 0) + 1;
            animateQuantity(id, 'up');
            return { ...prev, [id]: newQty };
        });
    };

    const decreaseQuantity = (id) => {
        setQuantities((prev) => {
            if (!prev[id] || prev[id] === 1) {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            }
            animateQuantity(id, 'down');
            return { ...prev, [id]: prev[id] - 1 };
        });
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
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />

                            <View style={styles.nameContainer}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productQuantity}>{item.quantity}</Text>
                            </View>

                            <View style={styles.flexSpacer} />

                            <View style={styles.priceContainer}>
                                <View style={styles.priceWrapper}>
                                    <FontAwesome name="dollar" size={14} color="#53B175" /> 
                                    <Text style={styles.productPrice}>{item.price.toFixed(2)}</Text>
                                </View>
                                <View style={styles.reviewContainer}>
                                    <FontAwesome name="star" size={14} color="#FFD700" />
                                    <Text style={styles.reviewText}>{item.review}</Text>
                                </View>
                            </View>

                            {quantities[item.id] ? (
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.quantityButton}>
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
                                            {quantities[item.id]}
                                        </Animated.Text>
                                    </View>

                                    <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.quantityButton}>
                                        <Text style={styles.quantityText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.addToCartButton}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        increaseQuantity(item.id);
                                    }}
                                >
                                    <Text style={styles.addToCartText}>Add to Cart</Text>
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    )}
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
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 3,
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
