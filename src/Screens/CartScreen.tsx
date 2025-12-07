import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '../store/Slices/CartSlice';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function CartScreen() {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<any>>();

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const onBuy = () => {
    dispatch(clearCart());
    navigation.navigate('Success' as never);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={i => String(i.productId)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.flexOne}>
              <Text style={styles.font600}>{item.name}</Text>
              <Text>
                ₹{item.price} • Qty: {item.quantity}
              </Text>
              <Text>Total: ₹{item.price * item.quantity}</Text>
            </View>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                onPress={() =>
                  dispatch(increaseQuantity({ productId: item.productId }))
                }
              >
                <Text style={styles.btn}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (item.quantity <= 1)
                    dispatch(removeFromCart({ productId: item.productId }));
                  else
                    dispatch(decreaseQuantity({ productId: item.productId }));
                }}
              >
                <Text style={styles.btn}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>Your cart is empty</Text>}
      />

      <View style={styles.footer}>
        <Text style={styles.font700}>Total: ₹{total}</Text>
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={onBuy}
          disabled={items.length === 0}
        >
          <Text style={styles.whiteBack}>Buy for ₹{total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qtyContainer: { justifyContent: 'center', alignItems: 'center' },
  whiteBack: { color: '#fff' },
  font700: { fontWeight: '700' },
  font600: { fontWeight: '600' },
  flexOne: { flex: 1 },
  container: { flex: 1, padding: 12, backgroundColor: '#f9f9f9' },
  row: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
  },
  btn: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 6,
    marginVertical: 6,
    width: 40,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buyBtn: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});
