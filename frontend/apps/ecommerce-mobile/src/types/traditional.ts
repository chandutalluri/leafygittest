export interface TraditionalItem {
  id: number;
  name: string;
  name_telugu: string;
  category: string;
  unit: string;
  prices: {
    ordinary: number;
    medium: number;
    best: number;
  };
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  name_telugu: string;
  item_count?: number;
}

export interface QualityTier {
  id: string;
  label: string;
  description: string;
}

export interface TraditionalOrderItem {
  item_id: number;
  name: string;
  name_telugu: string;
  unit: string;
  price: number;
  selected: boolean;
}

export interface TraditionalOrder {
  id?: number;
  customer_id: number;
  quality_tier: 'ordinary' | 'medium' | 'best';
  items: TraditionalOrderItem[];
  total_amount: number;
  delivery_address: string;
  order_date: string;
  status: string;
}