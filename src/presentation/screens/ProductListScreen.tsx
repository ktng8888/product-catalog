import { ActivityIndicator, FlatList, Text } from 'react-native';
import { useProducts } from '../hooks/useProducts';

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
        renderItem={({ item }) => <Text>{item.title}</Text>}
        ListEmptyComponent={<Text>No products found</Text>}
    />
    );
}