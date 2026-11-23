export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex';
  sizes: string[];
  colors: string[];
  image_url: string;
  stock: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface RawProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex';
  sizes: string;
  colors: string;
  image_url: string;
  stock: number;
  featured: number;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  product_image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  country: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CartItem {
  id: string; // `${productId}-${size}-${color}`
  productId: number;
  name: string;
  price: number;
  image_url: string;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  description: string;
  price: number;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex';
  sizes: string[];
  colors: string[];
  image_url: string;
  stock: number;
  featured?: boolean;
}

export interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  country: string;
  payment_method?: string;
  items: {
    productId: number;
    name: string;
    image_url: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
  }[];
}
