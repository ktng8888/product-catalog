import { ActivityIndicator, FlatList, Text, View, Button } from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

export function ProductListScreen() {
    const { products, isLoading, error, retry } = useProducts();

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

    return (
    <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={<Text>No products found</Text>}
    />
    );
}