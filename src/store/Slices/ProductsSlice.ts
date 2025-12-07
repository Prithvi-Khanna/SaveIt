// store/Slices/ProductsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../../Types';
import * as api from '../../Api/ProductsApi';

type State = {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: State = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProductsAsync = createAsyncThunk(
  'products/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await api.fetchProducts();
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.message ?? 'Unable to fetch products.',
      );
    }
  },
);

const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProductsAsync.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to load products.';
      });
  },
});

export default slice.reducer;
