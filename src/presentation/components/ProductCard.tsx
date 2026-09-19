import type {Product} from '../../data/models/Product';
import {Image, Text, Pressable} from 'react-native';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={product.title} accessibilityHint="Opens product details">
        <Image
            source={{ uri: product.thumbnail }}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
        />
        <Text>{product.title}</Text>
        <Text>{product.description}</Text>
        <Text>Price: ${product.price.toFixed(2)}</Text>
        <Text>Rating: {product.rating}</Text>
    </Pressable>
  );
}
