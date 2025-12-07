import { Product } from '../Types';
import { Platform } from 'react-native';

// Utility: fake network delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export async function fetchProducts(): Promise<Product[]> {
  // simulate API response delay (1.5–2 sec)
  await wait(500);

  try {
    const response = await fetch(`${BASE_URL}/products`);

    if (!response.ok) {
      throw new Error('Server error while fetching products');
    }

    const json = await response.json();

    return json as Product[];
  } catch (err) {
    console.log('API ERROR:', err);
    throw err;
  }
}
