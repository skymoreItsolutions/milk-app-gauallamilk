import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function SearchFilter({ item, entering }) {
  const router = useRouter();
  return (
    <Animated.View entering={entering}>
      <TouchableOpacity
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
        style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          marginVertical: 8,
          marginHorizontal: 10,
          borderRadius: 12,
          padding: 10,
          elevation: 2,
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 10,
            resizeMode: 'contain',
            backgroundColor: '#f5f5f5',
          }}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{item.name}</Text>
          <Text style={{ color: 'gray', fontSize: 13, marginTop: 2 }}>{item.category}</Text>
          <Text style={{ fontSize: 14, marginTop: 4 }}>{item.size} • ₹{item.price}</Text>
          <Text style={{ fontSize: 12, marginTop: 2, color: 'gray' }} numberOfLines={2}>
            {item.productDetails}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Ionicons name="star" size={14} color="#f1c40f" />
            <Text style={{ marginLeft: 4, fontSize: 13 }}>{item.review}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
