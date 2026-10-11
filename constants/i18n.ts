import type { Language } from '@/types';

type Dict = Record<string, Record<Language, string>>;

export const dict: Dict = {
  heroTitle: { en: 'EAT WELL.\nLIVE LIGHT.\nORDER HOME.', fr: 'MANGEZ SAIN.\nVIVEZ LÉGER.\nCOMMANDEZ.', ar: 'كُل صحي.\nعِش خفيفاً.\nاطلب الآن.' },
  heroSub: { en: 'Verified home cooks & licensed restaurants near you', fr: 'Cuisinières vérifiées et restaurants agréés près de vous', ar: 'طاهيات موثّقات ومطاعم مرخّصة بالقرب منك' },
  orderNow: { en: 'Order now', fr: 'Commander', ar: 'اطلب الآن' },
  deliverTo: { en: 'Deliver to', fr: 'Livrer à', ar: 'التوصيل إلى' },
  search: { en: 'Search dishes or kitchens', fr: 'Rechercher plats ou cuisines', ar: 'ابحث عن أطباق أو مطابخ' },
  all: { en: 'All', fr: 'Tout', ar: 'الكل' },
  restaurants: { en: 'Restaurants', fr: 'Restaurants', ar: 'مطاعم' },
  homeKitchens: { en: 'Home kitchens', fr: 'Cuisine maison', ar: 'مطابخ منزلية' },
  popular: { en: 'Popular this week', fr: 'Populaires cette semaine', ar: 'الأكثر طلباً هذا الأسبوع' },
  kitchensNear: { en: 'Kitchens near you', fr: 'Cuisines près de vous', ar: 'مطابخ بالقرب منك' },
  home: { en: 'Home', fr: 'Accueil', ar: 'الرئيسية' },
  cart: { en: 'Cart', fr: 'Panier', ar: 'السلة' },
  orders: { en: 'Orders', fr: 'Commandes', ar: 'الطلبات' },
  profile: { en: 'Profile', fr: 'Profil', ar: 'حسابي' },
  verified: { en: 'Verified', fr: 'Vérifié', ar: 'موثّق' },
  halal: { en: 'Halal', fr: 'Halal', ar: 'حلال' },
  add: { en: 'Add', fr: 'Ajouter', ar: 'أضف' },
  checkout: { en: 'Place order', fr: 'Valider la commande', ar: 'تأكيد الطلب' },
  cod: { en: 'Cash on delivery', fr: 'Paiement à la livraison', ar: 'الدفع عند الاستلام' },
  continue: { en: 'Continue', fr: 'Continuer', ar: 'متابعة' },
  guest: { en: 'Browse as guest', fr: 'Parcourir en invité', ar: 'تصفح كزائر' },
  chooseLanguage: { en: 'Choose language', fr: 'Choisir la langue', ar: 'اختر اللغة' },
};

export function t(key: keyof typeof dict, lang: Language): string {
  return dict[key]?.[lang] ?? dict[key]?.en ?? String(key);
}

export const isRTL = (lang: Language) => lang === 'ar';