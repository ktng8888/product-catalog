import { ActivityIndicator, FlatList, Text, View, Button } from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

export function ProductListScreen() {
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
            renderItem={({ item }) => <ProductCard product={item} />}
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