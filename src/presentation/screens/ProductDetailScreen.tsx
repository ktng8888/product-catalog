import {Product} from '../../data/models/Product';
import {
    ActivityIndicator,
    Button,
    Image,
    ScrollView,
    Text,
    View,
} from 'react-native';
import {useProductDetail} from '../hooks/useProductDetail';

interface ProductDetailScreenProps {
    productId: number;
}
export function ProductDetailScreen({ productId }: ProductDetailScreenProps) {

    const { product, isLoading, error, retry } = useProductDetail(productId);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return (
            <View>
            <Text>{error}</Text>
            <Button title="Retry" onPress={retry} />
            </View>
        );
    }

    if (!product) {
        return <Text>No product found</Text>;
    }

    return (
        <ScrollView>
            <Text>{product.title}</Text>
            <Text>{product.description}</Text>
            <Text>Price: ${product.price.toFixed(2)}</Text>
            <Text>Rating: {product.rating}</Text>

            {product.images.map((uri) => (
            <Image
                key={uri}
                source={{ uri }}
                style={{ width: 250, height: 250 }}
                resizeMode="contain"
            />
            ))}
        </ScrollView>
    );
}
    