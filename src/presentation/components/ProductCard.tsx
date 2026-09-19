import type {Product} from '../../data/models/Product';
import {Image, Text, View} from 'react-native';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <View>
        <Image
            source={{ uri: product.thumbnail }}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
        />
        <Text>{product.title}</Text>
        <Text>{product.description}</Text>
        <Text>Price: ${product.price.toFixed(2)}</Text>
        <Text>Rating: {product.rating}</Text>
    </View>
  );
}