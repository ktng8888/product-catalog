import { ActivityIndicator, FlatList, Text } from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

export function ProductListScreen() {
    const { products, isLoading, error } = useProducts();

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
    <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={<Text>No products found</Text>}
    />
    );
}