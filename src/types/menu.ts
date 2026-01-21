export type MenuCategory = 'burgers' | 'chicken' | 'breakfast' | 'sides' | 'drinks' | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  image?: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
}
