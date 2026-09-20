import { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [width, setWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>No images available</Text>
      </View>
    );
  }

  return (
    <View>
      <View
        style={styles.gallery}
        onLayout={(event) => {
          const nextWidth = event.nativeEvent.layout.width;

          if (nextWidth !== width) {
            setWidth(nextWidth);
            setSelectedIndex(0);
          }
        }}
      >
        {width > 0 && (
          <FlatList
            key={width}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri, index) => `${uri}-${index}`}
            renderItem={({ item, index }) => (
              <Image
                source={{ uri: item }}
                style={[styles.image, { width }]}
                resizeMode="contain"
                accessibilityLabel={`${title}, image ${index + 1} of ${images.length}`}
              />
            )}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );

              setSelectedIndex(
                Math.max(0, Math.min(index, images.length - 1))
              );
            }}
          />
        )}
      </View>

      {images.length > 1 && (
        <View
          style={styles.dots}
          accessible
          accessibilityLabel={`Image ${selectedIndex + 1} of ${images.length}`}
        >
          {images.map((uri, index) => (
            <View
              key={`${uri}-${index}`}
              style={[
                styles.dot,
                index === selectedIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gallery: {
    height: 270,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  image: {
    height: 270,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  activeDot: {
    backgroundColor: '#0F766E',
  },
  empty: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
});