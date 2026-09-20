import { ActivityIndicator, FlatList, Text, View, Button, TextInput } from 'react-native';
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
    searchQuery,
    setSearchQuery,
    } = useProducts();

    return (
        <View style={{ flex: 1 }}>
            <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            accessibilityLabel="Search products"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
                margin: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: '#999',
                borderRadius: 8,
            }}
            />

            {isLoading ? (
            <ActivityIndicator />
            ) : error ? (
            <View>
                <Text>{error}</Text>
                <Button title="Retry" onPress={retry} />
            </View>
            ) : (
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
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                />
            )}
        </View>
    );
}
