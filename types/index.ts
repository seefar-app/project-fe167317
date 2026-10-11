export type Language = 'ar' | 'fr' | 'en';
export type KitchenType = 'restaurant' | 'home_kitchen';
export type DishCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'bakery';
export type PaymentMethod = 'cod' | 'card' | 'baridimob';
export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface User {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  avatar: string | null;
  language_pref: Language;
  wilaya: string;
  commune: string;
  dietary_goals: string[];
  allergies: string[];
  role: 'customer' | 'kitchen_owner' | 'courier' | 'admin';
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  wilaya: string;
  commune: string;
  street: string;
  lat: number;
  lng: number;
  landmark_note: string;
  is_default: boolean;
}

export interface Kitchen {
  id: string;
  owner_id: string;
  type: KitchenType;
  display_name: string;
  story_text: string;
  cover_photo: string;
  owner_avatar: string;
  wilaya: string;
  commune: string;
  lat: number;
  lng: number;
  rating: number;
  review_count: number;
  delivery_fee_dzd: number;
  avg_prep_minutes: number;
  distance_km: number;
  is_verified: boolean;
  hygiene_cert_url: string | null;
  is_accepting_orders: boolean;
  daily_capacity: number;
  opening_hours: string;
  specialties: string[];
  created_at: string;
}

export interface Nutrition {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
}

export interface Customization {
  id: string;
  label: string;
  extra_price_dzd: number;
}

export interface Dish {
  id: string;
  kitchen_id: string;
  name: string;
  name_fr: string;
  name_ar: string;
  description: string;
  photos: string[];
  price_dzd: number;
  portion_grams: number;
  category: DishCategory;
  diet_tags: string[];
  allergens: string[];
  ingredients: string[];
  is_halal: boolean;
  is_available: boolean;
  nutrition: Nutrition;
  customizations: Customization[];
  weekday: number | null; // 0-6 weekly menu day, null = always
  created_at: string;
}

export interface CartItem {
  id: string;
  dish_id: string;
  kitchen_id: string;
  quantity: number;
  customization_ids: string[];
}

export interface Order {
  id: string;
  customer_id: string;
  kitchen_ids: string[];
  kitchen_name: string;
  kitchen_photo: string;
  address_id: string;
  address_label: string;
  status: OrderStatus;
  scheduled_for: string | null;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'paid';
  subtotal_dzd: number;
  delivery_fee_dzd: number;
  discount_dzd: number;
  total_dzd: number;
  courier_id: string | null;
  item_summary: string;
  items: { dish_id: string; name: string; quantity: number; unit_price_dzd: number }[];
  created_at: string;
  estimated_arrival_at: string;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle_type: 'motorbike' | 'bicycle' | 'car';
  current_lat: number;
  current_lng: number;
  is_online: boolean;
  rating: number;
  avatar: string;
}

export interface Review {
  id: string;
  order_id: string;
  user_id: string;
  kitchen_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  kitchen_id: string;
  meals_per_week: number;
  price_per_week_dzd: number;
  status: 'active' | 'paused' | 'cancelled';
  next_delivery_date: string;
}

export interface GoalChip {
  id: string;
  label: Record<Language, string>;
  icon: string;
}

export interface Wilaya {
  code: string;
  name: string;
  lat: number;
  lng: number;
}