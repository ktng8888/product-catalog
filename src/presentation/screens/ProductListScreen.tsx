import { ActivityIndicator, FlatList, Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    isRefreshing, 
    refresh, 
    refreshError
    } = useProducts();

    const insets = useSafeAreaInsets();
    const safeAreaStyle = { paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right };

    return (
        <View
            style={[styles.screen, safeAreaStyle]}
        >
            <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            accessibilityLabel="Search products"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
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
                    numColumns={2}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                    <View style={styles.cardSlot}>
                        <ProductCard
                        product={item}
                        onPress={() => onSelectProduct(item.id)}
                        />
                    </View>
                    )}
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

                    refreshing={isRefreshing}
                    onRefresh={() => {
                        void refresh();
                    }}
                    ListHeaderComponent={
                        refreshError ? (
                            <View style={styles.refreshMessage}>
                            <Text>{refreshError}</Text>
                            <Button
                                title="Retry refresh"
                                onPress={() => {
                                void refresh();
                                }}
                            />
                            </View>
                        ) : null
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  searchInput: {
    margin: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
  },
  screen: 
  {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  list: 
  {
    flex: 1,
  },
  listContent: 
  {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  row: 
  {
    alignItems: 'stretch',
    marginBottom: 12,
  },
  cardSlot: 
  {
    width: '50%',
    paddingHorizontal: 6,
  },
  refreshMessage: 
  {
    padding: 12,
    marginBottom: 12,
    gap: 8,
    },
});
