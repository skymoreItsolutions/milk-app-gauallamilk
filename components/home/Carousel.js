import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const images = [
  "https://static.vecteezy.com/system/resources/thumbnails/039/668/917/small_2x/ai-generated-a-bottle-of-milk-a-glass-of-milk-and-a-plate-of-cheese-on-the-table-in-front-of-the-cow-field-free-photo.jpeg",
  "https://images8.alphacoders.com/998/998376.jpg",
  "https://t3.ftcdn.net/jpg/05/29/62/88/360_F_529628848_KlzlgLqkPT3BifZ2q7GgfWgZRvOu95ui.jpg",
  "https://c4.wallpaperflare.com/wallpaper/798/46/343/cheese-mold-olives-food-wallpaper-preview.jpg",
  "https://t3.ftcdn.net/jpg/11/57/90/12/360_F_1157901220_0ctBdFnFZWxjws0Z3OvcX7764FWdCLGm.jpg"
];

const screenWidth = Dimensions.get('window').width;
const DOT_SIZE = 10;  
const DOT_MARGIN = 6; 
const DOT_SPACING = DOT_SIZE + DOT_MARGIN; 

const MyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const dotTranslateX = useRef(new Animated.Value(0)).current;
  const moveIndicator = (index) => {
    setCurrentIndex(index);
    carouselRef.current?.scrollTo({ index, animated: true });

    Animated.spring(dotTranslateX, {
      toValue: index * DOT_SPACING, 
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        loop
        width={screenWidth}
        height={200}
        autoPlay={true}
        autoPlayInterval={3000}
        autoplayDelay={1000}
        data={images}
        onSnapToItem={moveIndicator} 
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        )}
      />

    
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => moveIndicator(index)}>
            <View style={styles.dot} />
          </TouchableOpacity>
        ))}

        
        <Animated.View
          style={[
            styles.activeDot,
            { transform: [{ translateX: dotTranslateX }] }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    marginTop: 15
  },
  image: {
    width: '94%',
    height: '100%',
    borderRadius: 6,
    margin: 'auto'
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    position: 'relative',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderColor: '#53B175',
    marginHorizontal: DOT_MARGIN / 2, 
    borderWidth:1
  },
  activeDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#53B175',
    position: 'absolute',
    left: 3,
  },
});

export default MyCarousel;
