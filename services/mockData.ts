import type { Address, Courier, Dish, GoalChip, Kitchen, Order, Wilaya } from '@/types';

const now = new Date().toISOString();

export const WILAYAS: Wilaya[] = [
  { code: '16', name: 'Alger', lat: 36.7538, lng: 3.0588 },
  { code: '31', name: 'Oran', lat: 35.6971, lng: -0.6308 },
  { code: '25', name: 'Constantine', lat: 36.365, lng: 6.6147 },
  { code: '09', name: 'Blida', lat: 36.47, lng: 2.8277 },
  { code: '19', name: 'Sétif', lat: 36.1898, lng: 5.4108 },
  { code: '23', name: 'Annaba', lat: 36.9, lng: 7.7667 },
  { code: '06', name: 'Béjaïa', lat: 36.7509, lng: 5.0567 },
  { code: '15', name: 'Tizi Ouzou', lat: 36.7169, lng: 4.0497 },
];

export const GOALS: GoalChip[] = [
  { id: 'low-calorie', label: { en: 'Low calorie', fr: 'Faible en calories', ar: 'سعرات قليلة' }, icon: 'leaf-outline' },
  { id: 'high-protein', label: { en: 'High protein', fr: 'Riche en protéines', ar: 'بروتين عالٍ' }, icon: 'barbell-outline' },
  { id: 'diabetic-friendly', label: { en: 'Diabetic friendly', fr: 'Adapté diabète', ar: 'مناسب للسكري' }, icon: 'heart-outline' },
  { id: 'low-sugar', label: { en: 'Low sugar', fr: 'Peu de sucre', ar: 'سكر قليل' }, icon: 'water-outline' },
  { id: 'vegetarian', label: { en: 'Vegetarian', fr: 'Végétarien', ar: 'نباتي' }, icon: 'nutrition-outline' },
  { id: 'gluten-free', label: { en: 'Gluten free', fr: 'Sans gluten', ar: 'خالٍ من الغلوتين' }, icon: 'ban-outline' },
  { id: 'whole-grain', label: { en: 'Whole grain', fr: 'Complet', ar: 'حبوب كاملة' }, icon: 'flower-outline' },
];

export const KITCHENS: Kitchen[] = [
  {
    id: 'k1', owner_id: 'o1', type: 'home_kitchen', display_name: 'Cuisine de Samira',
    story_text: 'Samira has been cooking light, family-style Algerian dishes for 15 years. Everything is prepared fresh each morning in her home kitchen with local produce.',
    cover_photo: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800',
    owner_avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    wilaya: 'Alger', commune: 'Bab Ezzouar', lat: 36.7167, lng: 3.1833,
    rating: 4.9, review_count: 312, delivery_fee_dzd: 150, avg_prep_minutes: 35, distance_km: 1.8,
    is_verified: true, hygiene_cert_url: 'cert/k1.pdf', is_accepting_orders: true, daily_capacity: 25,
    opening_hours: '10:00 – 20:00', specialties: ['Chorba légère', 'Couscous complet', 'Salades'], created_at: now,
  },
  {
    id: 'k2', owner_id: 'o2', type: 'restaurant', display_name: 'Green Bowl Alger',
    story_text: 'A licensed healthy-food restaurant serving macro-balanced bowls, grilled proteins and fresh juices, with calorie counts on every plate.',
    cover_photo: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    owner_avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    wilaya: 'Alger', commune: 'Hydra', lat: 36.7411, lng: 3.0357,
    rating: 4.7, review_count: 874, delivery_fee_dzd: 200, avg_prep_minutes: 25, distance_km: 3.2,
    is_verified: true, hygiene_cert_url: 'cert/k2.pdf', is_accepting_orders: true, daily_capacity: 120,
    opening_hours: '09:00 – 23:00', specialties: ['Bowls', 'Grillades', 'Jus frais'], created_at: now,
  },
  {
    id: 'k3', owner_id: 'o3', type: 'home_kitchen', display_name: 'Les Délices de Nadia',
    story_text: 'Nadia bakes whole-grain breads, low-sugar traditional pastries and diabetic-friendly desserts, all made with dates and honey instead of refined sugar.',
    cover_photo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800',
    owner_avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    wilaya: 'Blida', commune: 'Boufarik', lat: 36.5736, lng: 2.9101,
    rating: 4.8, review_count: 198, delivery_fee_dzd: 250, avg_prep_minutes: 45, distance_km: 5.4,
    is_verified: true, hygiene_cert_url: 'cert/k3.pdf', is_accepting_orders: true, daily_capacity: 15,
    opening_hours: '08:00 – 17:00', specialties: ['Pain complet', 'Makrout sans sucre', 'Granola'], created_at: now,
  },
  {
    id: 'k4', owner_id: 'o4', type: 'restaurant', display_name: 'Fit Kitchen Oran',
    story_text: 'Oran’s favourite protein-forward kitchen. Chicken, fish and legume plates cooked with olive oil and no frying.',
    cover_photo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    owner_avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    wilaya: 'Oran', commune: 'Es Senia', lat: 35.6406, lng: -0.6258,
    rating: 4.6, review_count: 540, delivery_fee_dzd: 200, avg_prep_minutes: 30, distance_km: 2.6,
    is_verified: true, hygiene_cert_url: 'cert/k4.pdf', is_accepting_orders: true, daily_capacity: 90,
    opening_hours: '10:00 – 22:30', specialties: ['Poulet grillé', 'Poisson', 'Légumineuses'], created_at: now,
  },
  {
    id: 'k5', owner_id: 'o5', type: 'home_kitchen', display_name: 'Maison Yasmine',
    story_text: 'Vegetarian and gluten-free homemade meals from Constantine — rooted in traditional recipes, lightened with fresh vegetables and herbs.',
    cover_photo: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800',
    owner_avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    wilaya: 'Constantine', commune: 'El Khroub', lat: 36.2647, lng: 6.6936,
    rating: 4.9, review_count: 121, delivery_fee_dzd: 180, avg_prep_minutes: 40, distance_km: 4.1,
    is_verified: true, hygiene_cert_url: 'cert/k5.pdf', is_accepting_orders: false, daily_capacity: 12,
    opening_hours: '11:00 – 19:00', specialties: ['Plats végétariens', 'Sans gluten', 'Soupes'], created_at: now,
  },
];

const nut = (kcal: number, protein_g: number, carbs_g: number, fat_g: number, fiber_g: number, sugar_g: number) => ({
  kcal, protein_g, carbs_g, fat_g, fiber_g, sugar_g,
});

export const DISHES: Dish[] = [
  {
    id: 'd1', kitchen_id: 'k1', name: 'Light Chorba Frik', name_fr: 'Chorba frik légère', name_ar: 'شوربة فريك خفيفة',
    description: 'Traditional frik soup with lean lamb, fresh coriander and a squeeze of lemon. No frying, no cream.',
    photos: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'],
    price_dzd: 450, portion_grams: 350, category: 'lunch', diet_tags: ['low-calorie', 'whole-grain'], allergens: ['gluten'],
    ingredients: ['Frik (green wheat)', 'Lean lamb', 'Tomato', 'Chickpeas', 'Coriander', 'Lemon'], is_halal: true, is_available: true,
    nutrition: nut(280, 18, 32, 8, 7, 4),
    customizations: [{ id: 'c1', label: 'No salt', extra_price_dzd: 0 }, { id: 'c2', label: 'Extra lemon', extra_price_dzd: 0 }, { id: 'c3', label: 'Whole-grain bread', extra_price_dzd: 60 }],
    weekday: 0, created_at: now,
  },
  {
    id: 'd2', kitchen_id: 'k1', name: 'Whole-grain Couscous Bowl', name_fr: 'Couscous complet aux légumes', name_ar: 'كسكسي كامل بالخضر',
    description: 'Steamed whole-wheat couscous with seven seasonal vegetables and chickpeas, served with a light broth.',
    photos: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800'],
    price_dzd: 600, portion_grams: 420, category: 'lunch', diet_tags: ['vegetarian', 'whole-grain', 'low-sugar'], allergens: ['gluten'],
    ingredients: ['Whole-wheat couscous', 'Carrot', 'Zucchini', 'Turnip', 'Chickpeas', 'Olive oil'], is_halal: true, is_available: true,
    nutrition: nut(390, 14, 62, 9, 11, 6),
    customizations: [{ id: 'c4', label: 'Add grilled chicken', extra_price_dzd: 180 }, { id: 'c5', label: 'Sauce on the side', extra_price_dzd: 0 }],
    weekday: 1, created_at: now,
  },
  {
    id: 'd3', kitchen_id: 'k2', name: 'Protein Power Bowl', name_fr: 'Bowl protéiné', name_ar: 'وعاء البروتين',
    description: 'Grilled chicken breast, quinoa, avocado, edamame and a tahini-lemon dressing.',
    photos: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'],
    price_dzd: 950, portion_grams: 460, category: 'lunch', diet_tags: ['high-protein', 'gluten-free'], allergens: ['sesame'],
    ingredients: ['Chicken breast', 'Quinoa', 'Avocado', 'Edamame', 'Cucumber', 'Tahini'], is_halal: true, is_available: true,
    nutrition: nut(520, 46, 38, 20, 9, 5),
    customizations: [{ id: 'c6', label: 'Extra protein', extra_price_dzd: 200 }, { id: 'c7', label: 'No sauce', extra_price_dzd: 0 }, { id: 'c8', label: 'Side salad', extra_price_dzd: 90 }],
    weekday: null, created_at: now,
  },
  {
    id: 'd4', kitchen_id: 'k2', name: 'Grilled Salmon & Greens', name_fr: 'Saumon grillé aux légumes verts', name_ar: 'سلمون مشوي مع خضروات',
    description: 'Omega-3 rich salmon fillet with steamed broccoli, asparagus and lemon-dill sauce.',
    photos: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800'],
    price_dzd: 1350, portion_grams: 380, category: 'dinner', diet_tags: ['high-protein', 'low-calorie', 'diabetic-friendly', 'gluten-free'], allergens: ['fish'],
    ingredients: ['Salmon', 'Broccoli', 'Asparagus', 'Lemon', 'Dill', 'Olive oil'], is_halal: true, is_available: true,
    nutrition: nut(430, 38, 12, 25, 6, 3),
    customizations: [{ id: 'c9', label: 'No salt', extra_price_dzd: 0 }, { id: 'c10', label: 'Brown rice', extra_price_dzd: 100 }],
    weekday: null, created_at: now,
  },
  {
    id: 'd5', kitchen_id: 'k3', name: 'Date & Honey Whole-grain Bread', name_fr: 'Pain complet dattes & miel', name_ar: 'خبز كامل بالتمر والعسل',
    description: 'Stone-ground whole-wheat loaf sweetened only with dates and a touch of honey. Slow-fermented.',
    photos: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'],
    price_dzd: 380, portion_grams: 500, category: 'bakery', diet_tags: ['whole-grain', 'low-sugar', 'vegetarian'], allergens: ['gluten'],
    ingredients: ['Whole-wheat flour', 'Dates', 'Honey', 'Yeast', 'Sea salt'], is_halal: true, is_available: true,
    nutrition: nut(210, 7, 38, 3, 6, 9),
    customizations: [{ id: 'c11', label: 'Sliced', extra_price_dzd: 0 }],
    weekday: 2, created_at: now,
  },
  {
    id: 'd6', kitchen_id: 'k3', name: 'Sugar-free Makrout', name_fr: 'Makrout sans sucre ajouté', name_ar: 'مقروط بدون سكر مضاف',
    description: 'Semolina and date pastry baked (never fried), sweetened naturally. Diabetic-friendly portion of 3 pieces.',
    photos: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800'],
    price_dzd: 520, portion_grams: 150, category: 'snack', diet_tags: ['diabetic-friendly', 'low-sugar', 'vegetarian'], allergens: ['gluten', 'nuts'],
    ingredients: ['Semolina', 'Dates', 'Olive oil', 'Orange blossom'], is_halal: true, is_available: true,
    nutrition: nut(240, 5, 42, 6, 5, 8),
    customizations: [{ id: 'c12', label: 'Gift box', extra_price_dzd: 150 }],
    weekday: null, created_at: now,
  },
  {
    id: 'd7', kitchen_id: 'k4', name: 'Herb Grilled Chicken Plate', name_fr: 'Poulet grillé aux herbes', name_ar: 'دجاج مشوي بالأعشاب',
    description: 'Free-range chicken marinated in thyme and garlic, grilled and served with lentils and roasted vegetables.',
    photos: ['https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800'],
    price_dzd: 850, portion_grams: 440, category: 'dinner', diet_tags: ['high-protein', 'gluten-free', 'low-sugar'], allergens: [],
    ingredients: ['Chicken', 'Lentils', 'Bell pepper', 'Zucchini', 'Thyme', 'Garlic'], is_halal: true, is_available: true,
    nutrition: nut(480, 52, 30, 16, 10, 4),
    customizations: [{ id: 'c13', label: 'Extra protein', extra_price_dzd: 220 }, { id: 'c14', label: 'No salt', extra_price_dzd: 0 }],
    weekday: null, created_at: now,
  },
  {
    id: 'd8', kitchen_id: 'k4', name: 'Chickpea Hummus Salad', name_fr: 'Salade houmous pois chiches', name_ar: 'سلطة الحمص',
    description: 'Fresh salad with creamy hummus, cherry tomatoes, cucumber and za’atar. Fully plant-based.',
    photos: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'],
    price_dzd: 520, portion_grams: 320, category: 'snack', diet_tags: ['vegetarian', 'low-calorie', 'gluten-free'], allergens: ['sesame'],
    ingredients: ['Chickpeas', 'Tahini', 'Tomato', 'Cucumber', 'Za’atar', 'Olive oil'], is_halal: true, is_available: true,
    nutrition: nut(310, 12, 34, 14, 11, 6),
    customizations: [{ id: 'c15', label: 'Sauce on the side', extra_price_dzd: 0 }],
    weekday: null, created_at: now,
  },
  {
    id: 'd9', kitchen_id: 'k5', name: 'Stuffed Zucchini (Vegetarian)', name_fr: 'Courgettes farcies végétariennes', name_ar: 'كوسة محشية نباتية',
    description: 'Zucchini stuffed with rice, herbs and tomato, slow-cooked in a light vegetable sauce.',
    photos: ['https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800'],
    price_dzd: 580, portion_grams: 400, category: 'lunch', diet_tags: ['vegetarian', 'gluten-free', 'low-calorie'], allergens: [],
    ingredients: ['Zucchini', 'Rice', 'Tomato', 'Parsley', 'Mint', 'Olive oil'], is_halal: true, is_available: true,
    nutrition: nut(270, 8, 44, 7, 6, 8),
    customizations: [{ id: 'c16', label: 'No salt', extra_price_dzd: 0 }],
    weekday: null, created_at: now,
  },
  {
    id: 'd10', kitchen_id: 'k5', name: 'Lentil & Spinach Soup', name_fr: 'Soupe lentilles & épinards', name_ar: 'شوربة العدس والسبانخ',
    description: 'Warming red lentil soup with spinach and cumin. Rich in iron and fibre.',
    photos: ['https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800'],
    price_dzd: 380, portion_grams: 330, category: 'dinner', diet_tags: ['vegetarian', 'diabetic-friendly', 'gluten-free', 'low-calorie'], allergens: [],
    ingredients: ['Red lentils', 'Spinach', 'Carrot', 'Cumin', 'Lemon'], is_halal: true, is_available: true,
    nutrition: nut(230, 14, 36, 3, 12, 4),
    customizations: [{ id: 'c17', label: 'Extra lemon', extra_price_dzd: 0 }],
    weekday: null, created_at: now,
  },
];

export const DEFAULT_ADDRESS: Address = {
  id: 'a1', user_id: 'guest', label: 'Home', wilaya: 'Alger', commune: 'Bab Ezzouar',
  street: 'Cité 1200 Logements, Bât. C', lat: 36.7167, lng: 3.1833, landmark_note: 'Near the tram station', is_default: true,
};

export const COURIER: Courier = {
  id: 'c1', name: 'Karim Hadj', phone: '+213 550 12 34 56', vehicle_type: 'motorbike',
  current_lat: 36.7311, current_lng: 3.1311, is_online: true, rating: 4.8,
  avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
};

const mins = (m: number) => new Date(Date.now() + m * 60000).toISOString();
const ago = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-seed-1', customer_id: 'guest', kitchen_ids: ['k2'], kitchen_name: 'Green Bowl Alger',
    kitchen_photo: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    address_id: 'a1', address_label: 'Home', status: 'delivered', scheduled_for: null,
    payment_method: 'cod', payment_status: 'paid', subtotal_dzd: 2300, delivery_fee_dzd: 200, discount_dzd: 0, total_dzd: 2500,
    courier_id: 'c1', item_summary: '1× Protein Power Bowl, 1× Grilled Salmon & Greens',
    items: [
      { dish_id: 'd3', name: 'Protein Power Bowl', quantity: 1, unit_price_dzd: 950 },
      { dish_id: 'd4', name: 'Grilled Salmon & Greens', quantity: 1, unit_price_dzd: 1350 },
    ],
    created_at: ago(3), estimated_arrival_at: ago(3),
  },
  {
    id: 'ord-seed-2', customer_id: 'guest', kitchen_ids: ['k1'], kitchen_name: 'Cuisine de Samira',
    kitchen_photo: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400',
    address_id: 'a1', address_label: 'Home', status: 'out_for_delivery', scheduled_for: null,
    payment_method: 'cod', payment_status: 'pending', subtotal_dzd: 1050, delivery_fee_dzd: 150, discount_dzd: 0, total_dzd: 1200,
    courier_id: 'c1', item_summary: '1× Light Chorba Frik, 1× Whole-grain Couscous Bowl',
    items: [
      { dish_id: 'd1', name: 'Light Chorba Frik', quantity: 1, unit_price_dzd: 450 },
      { dish_id: 'd2', name: 'Whole-grain Couscous Bowl', quantity: 1, unit_price_dzd: 600 },
    ],
    created_at: mins(-20), estimated_arrival_at: mins(14),
  },
];

export const PROMOS: Record<string, number> = { SAHA10: 0.1, FIRST20: 0.2 };

export const DELIVERY_SLOTS = ['ASAP (30–45 min)', 'Today 12:30', 'Today 13:30', 'Today 19:30', 'Tomorrow 12:30'];

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200';
export const SPLASH_IMAGE = 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200';