import type {Product} from '../../data/models/Product';
import {Image, Text, Pressable, StyleSheet} from 'react-native';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, $${product.price.toFixed(2)}`}
      accessibilityHint="Opens product details"
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.thumbnail}
        resizeMode="contain"
      />

      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>

      <Text style={styles.price}>
        ${product.price.toFixed(2)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: 
  {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pressed: 
  {
    opacity: 0.75,
    backgroundColor: '#F0FDFA',
  },
  thumbnail: 
  {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 12,
  },
  title: 
  {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  price: 
  {
    marginTop: 'auto',
    fontSize: 17,
    fontWeight: '700',
    color: '#0F766E',
  },
});
