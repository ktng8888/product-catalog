import { ActivityIndicator, FlatList, Text, View, Button } from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

interface ProductListScreenProps {
    onSelectProduct: (productId: number) => void;
}

export function ProductListScreen({ onSelectProduct }: ProductListScreenProps) {
    const {
    products,
    isLoading,
    error,
    retry,
    loadMore,
    hasMore,
    isLoadingMore,
    loadMoreError,
    } = useProducts();

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
            renderItem={({ item }) => <ProductCard product={item} onPress={() => onSelectProduct(item.id)} />}
            ListEmptyComponent={<Text>No products found</Text>}
            onEndReached={() => {
                if (hasMore && !isLoadingMore && !loadMoreError) {
                    void loadMore();
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                isLoadingMore ? (
                    <ActivityIndicator />
                ) : loadMoreError ? (
                    <View>
                    <Text>{loadMoreError}</Text>
                    <Button
                        title="Retry loading more"
                        onPress={() => {
                        void loadMore();
                        }}
                    />
                    </View>
                ) : null
            }
        />
    );
}
