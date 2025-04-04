import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import { decrementQuantity, incrementQuantity } from '../redux/CartReducer';
import Ionicons from '@expo/vector-icons/Ionicons';

const Productdetails = () => {
  const params = useLocalSearchParams();
  const nutrients = JSON.parse(params.nutrients || '[]');
  const dispatch = useDispatch();
  const router = useRouter();

  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);
  const [isNutrientsVisible, setIsNutrientsVisible] = useState(false);
  const [isReviewsVisible, setIsReviewsVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);

  const item = {
    id: params.id,
    name: params.name,
    image: params.image,
    price: params.price,
    size: params.size,
    quantity,
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <AntDesign
        key={i}
        name={i < rating ? 'star' : 'staro'}
        size={16}
        color="#f1c40f"
        style={{ marginRight: 2 }}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.imageWrapper}>
  <Image source={{ uri: params.image }} style={styles.productImage} />
  
  
        <View style={styles.topIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>


        <View style={{ padding: 15 }}>
          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.productName}>{params.name}</Text>
              <Text style={styles.productQuantity}>{params.size}</Text>
            </View>
            <TouchableOpacity onPress={toggleWishlist}>
              <AntDesign
                name={isWishlisted ? 'heart' : 'hearto'}
                size={24}
                color={isWishlisted ? 'red' : 'gray'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                    dispatch(decrementQuantity(item));
                  }
                }}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityTexts}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => {
                  setQuantity(quantity + 1);
                  dispatch(incrementQuantity(item));
                }}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.price}>₹{params.price}</Text>
          </View>

          <View style={styles.divider} />
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Product Description</Text>
              <TouchableOpacity onPress={() => setIsDescriptionVisible(!isDescriptionVisible)}>
                <AntDesign name={isDescriptionVisible ? 'up' : 'down'} size={20} color="black" />
              </TouchableOpacity>
            </View>
            {isDescriptionVisible && (
              <Text style={styles.productDetails}>{params.productDetails}</Text>
            )}
          </View>

          <View style={styles.divider} />
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nutrients</Text>
              <TouchableOpacity onPress={() => setIsNutrientsVisible(!isNutrientsVisible)}>
                <AntDesign name={isNutrientsVisible ? 'up' : 'down'} size={20} color="black" />
              </TouchableOpacity>
            </View>
            {isNutrientsVisible && (
              <View style={{ marginTop: 5 }}>
                {nutrients.map((nutrient, index) => (
                  <Text key={index} style={styles.productDetails}>• {nutrient}</Text>
                ))}
              </View>
            )}
          </View>

          <View style={styles.divider} />
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity onPress={() => setIsReviewsVisible(!isReviewsVisible)}>
                <AntDesign name={isReviewsVisible ? 'up' : 'down'} size={20} color="black" />
              </TouchableOpacity>
            </View>
            {isReviewsVisible && (
              <View style={{ marginTop: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {renderStars(Math.round(parseFloat(params.review)))}
                  <Text style={styles.ratingText}>{params.review} / 5</Text>
                </View>
                <Text style={styles.productDetails}>Based on customer feedback.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Add to Basket Button */}
      <View style={styles.addToBasketContainer}>
        <TouchableOpacity style={styles.addToBasketButton}>
          <Text style={styles.addToBasketText}>Add to Basket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Productdetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  topIcons: {
    position: 'absolute',
    top: 5,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    borderRadius: 20,
  },
  
  imageWrapper: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 15,
    color: 'gray',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  quantityButton: {
    borderColor: '#EAEAEA',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  quantityTexts: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginBottom: 10,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  addToBasketContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#EAEAEA',
  },
  addToBasketButton: {
    backgroundColor: '#53B175',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToBasketText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
