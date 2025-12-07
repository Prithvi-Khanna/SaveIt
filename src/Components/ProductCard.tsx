import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '../store/Slices/CartSlice';

function ProductCard({ product, onAdd }: any) {
  const dispatch = useDispatch();

  // Check if product is already in cart
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find(i => i.productId === product.id),
  );

  const handleDecrease = () => {
    if (!cartItem) return;

    if (cartItem.quantity === 1) {
      // If it becomes zero, remove from cart
      dispatch(removeFromCart({ productId: product.id }));
    } else {
      dispatch(decreaseQuantity({ productId: product.id }));
    }
  };

  const handleIncrease = () => {
    dispatch(increaseQuantity({ productId: product.id }));
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.price}>₹{product.price}</Text>
      {cartItem ? (
        <View style={styles.stepperContainer}>
          <TouchableOpacity style={styles.stepperBtn} onPress={handleDecrease}>
            <Text style={styles.stepperText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{cartItem.quantity}</Text>
          <TouchableOpacity style={styles.stepperBtn} onPress={handleIncrease}>
            <Text style={styles.stepperText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAdd(product)}
        >
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default React.memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#b3def8ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 6,
  },
  title: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  price: {
    marginTop: 4,
    color: '#555',
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#2b6cb0',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  stepperContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepperBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#eee',
  },
  stepperText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});
