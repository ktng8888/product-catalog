import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductDetail } from '../hooks/useProductDetail';
import { ProductImageGallery } from '../components/ProductImageGallery';

interface ProductDetailScreenProps {
    productId: number;
}

export function ProductDetailScreen({
  productId,
}: ProductDetailScreenProps) {
  const { product, isLoading, error, retry } =
    useProductDetail(productId);
  const insets = useSafeAreaInsets();
  const safeAreaStyle = { paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right };

  return (
    <View
      style={[styles.screen, safeAreaStyle]}
    >
      {isLoading ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color="#0F766E" />
          <Text style={styles.stateText}>Loading product...</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Text style={styles.stateText}>{error}</Text>
          <Button title="Retry" onPress={retry} color="#0F766E" />
        </View>
      ) : !product ? (
        <View style={styles.state}>
          <Text style={styles.stateText}>No product found</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <ProductImageGallery
            key={product.id}
            images={product.images}
            title={product.title}
          />

        <View style={styles.productHeading}>
        <Text style={styles.productTitle}>
            {product.title}
        </Text>

        <Text style={styles.price}>
            ${product.price.toFixed(2)}
        </Text>
        </View>

        <Text style={styles.description}>
            {product.description}
        </Text>

        <View
            style={styles.ratingRow}
            accessible
            accessibilityLabel={`Rated ${product.rating} out of 5`}
        >
        <Text style={styles.ratingStar}>★</Text>
        <Text style={styles.rating}>{product.rating}</Text>
        </View>
    </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        margin: 12,
    },
    screen: 
    {
        flex: 1,
        backgroundColor: '#F8FAFC',
        
    },
    content: 
    {
        padding: 12,
    },
    state: 
    {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    stateText: 
    {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: '#475569',
    },
    productHeading: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 20,
    },
    productTitle: {
        flex: 1,
        fontSize: 22,
        lineHeight: 30,
        fontWeight: '600',
        color: '#0F172A',
    },
    price: {
        flexShrink: 0,
        fontSize: 20,
        lineHeight: 30,
        fontWeight: '700',
        color: '#0F172A',
    },
    description: {
        marginTop: 14,
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
        textAlign: 'justify',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 20,
    },
    ratingStar: {
        fontSize: 18,
        color: '#B45309',
    },
    rating: {
        fontSize: 15,
        color: '#475569',
    },
});
