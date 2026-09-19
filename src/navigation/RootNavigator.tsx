import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductListScreen } from '../presentation/screens/ProductListScreen';
import { ProductDetailScreen } from '../presentation/screens/ProductDetailScreen';

type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function ProductListRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'ProductList'>) {
  return (
    <ProductListScreen
      onSelectProduct={(productId) =>
        navigation.navigate('ProductDetail', { productId })
      }
    />
  );
}

function ProductDetailRoute({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ProductDetail'>) {
  return <ProductDetailScreen productId={route.params.productId} />;
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductList">
        <Stack.Screen
          name="ProductList"
          component={ProductListRoute}
          options={{ title: 'Product Catalog' }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailRoute}
          options={{ title: 'Product Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
