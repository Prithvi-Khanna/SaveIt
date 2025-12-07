export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
