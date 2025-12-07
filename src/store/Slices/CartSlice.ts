import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../Types';

type State = { items: CartItem[] };

const initialState: State = { items: [] };

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{
        productId: number;
        name: string;
        price: number;
        imageUrl?: string;
      }>,
    ) {
      const { productId, name, price, imageUrl } = action.payload;

      const existing = state.items.find(i => i.productId === productId);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          productId,
          name,
          price,
          quantity: 1,
          imageUrl: imageUrl ?? '', // ensure no undefined values
        });
      }
    },

    increaseQuantity(state, action: PayloadAction<{ productId: number }>) {
      const item = state.items.find(
        i => i.productId === action.payload.productId,
      );
      if (item) item.quantity += 1;
    },

    decreaseQuantity(state, action: PayloadAction<{ productId: number }>) {
      const item = state.items.find(
        i => i.productId === action.payload.productId,
      );
      if (item) item.quantity = Math.max(1, item.quantity - 1);
    },

    removeFromCart(state, action: PayloadAction<{ productId: number }>) {
      state.items = state.items.filter(
        i => i.productId !== action.payload.productId,
      );
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = slice.actions;

export default slice.reducer;
