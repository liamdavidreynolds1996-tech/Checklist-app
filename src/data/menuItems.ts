import { MenuItem } from '../types/menu';

export const MENU_ITEMS: MenuItem[] = [
  // Burgers
  {
    id: 'big-mac',
    name: 'Big Mac',
    category: 'burgers',
    price: 5.99,
    description: 'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun',
  },
  {
    id: 'quarter-pounder',
    name: 'Quarter Pounder with Cheese',
    category: 'burgers',
    price: 6.49,
    description: 'Quarter pound of 100% fresh beef, two slices of cheese, onions, pickles, ketchup, and mustard',
  },
  {
    id: 'mcdouble',
    name: 'McDouble',
    category: 'burgers',
    price: 3.99,
    description: 'Two 100% beef patties, pickles, onions, ketchup and mustard on a toasted bun',
  },
  {
    id: 'cheeseburger',
    name: 'Cheeseburger',
    category: 'burgers',
    price: 2.49,
    description: '100% beef patty, pickles, onions, ketchup, mustard, and a slice of melty American cheese',
  },
  {
    id: 'hamburger',
    name: 'Hamburger',
    category: 'burgers',
    price: 1.99,
    description: '100% beef patty, pickles, onions, ketchup and mustard on a toasted bun',
  },

  // Chicken
  {
    id: 'mcchicken',
    name: 'McChicken',
    category: 'chicken',
    price: 3.49,
    description: 'Crispy chicken sandwich with lettuce and mayo',
  },
  {
    id: 'spicy-mcchicken',
    name: 'Spicy McChicken',
    category: 'chicken',
    price: 3.49,
    description: 'Crispy spicy chicken sandwich with lettuce and mayo',
  },
  {
    id: 'chicken-nuggets-10',
    name: 'Chicken McNuggets (10pc)',
    category: 'chicken',
    price: 5.99,
    description: 'Tender and juicy chicken nuggets made with white meat',
  },
  {
    id: 'chicken-nuggets-20',
    name: 'Chicken McNuggets (20pc)',
    category: 'chicken',
    price: 9.99,
    description: 'Tender and juicy chicken nuggets made with white meat',
  },

  // Breakfast
  {
    id: 'egg-mcmuffin',
    name: 'Egg McMuffin',
    category: 'breakfast',
    price: 4.49,
    description: 'Freshly cracked egg, Canadian bacon, and American cheese on a toasted English muffin',
  },
  {
    id: 'sausage-mcmuffin',
    name: 'Sausage McMuffin with Egg',
    category: 'breakfast',
    price: 4.79,
    description: 'Sausage patty, freshly cracked egg, and American cheese on a toasted English muffin',
  },
  {
    id: 'hotcakes',
    name: 'Hotcakes',
    category: 'breakfast',
    price: 3.99,
    description: 'Three fluffy golden hotcakes with butter and syrup',
  },
  {
    id: 'hash-browns',
    name: 'Hash Browns',
    category: 'breakfast',
    price: 1.99,
    description: 'Crispy, golden brown shredded potato',
  },

  // Sides
  {
    id: 'fries-small',
    name: 'French Fries (Small)',
    category: 'sides',
    price: 2.49,
    description: 'World famous golden French fries',
  },
  {
    id: 'fries-medium',
    name: 'French Fries (Medium)',
    category: 'sides',
    price: 3.29,
    description: 'World famous golden French fries',
  },
  {
    id: 'fries-large',
    name: 'French Fries (Large)',
    category: 'sides',
    price: 3.99,
    description: 'World famous golden French fries',
  },

  // Drinks
  {
    id: 'coke-small',
    name: 'Coca-Cola (Small)',
    category: 'drinks',
    price: 1.49,
    description: 'Refreshing Coca-Cola',
  },
  {
    id: 'coke-medium',
    name: 'Coca-Cola (Medium)',
    category: 'drinks',
    price: 1.99,
    description: 'Refreshing Coca-Cola',
  },
  {
    id: 'coke-large',
    name: 'Coca-Cola (Large)',
    category: 'drinks',
    price: 2.49,
    description: 'Refreshing Coca-Cola',
  },
  {
    id: 'sprite-medium',
    name: 'Sprite (Medium)',
    category: 'drinks',
    price: 1.99,
    description: 'Crisp lemon-lime soda',
  },
  {
    id: 'orange-juice',
    name: 'Orange Juice',
    category: 'drinks',
    price: 2.99,
    description: '100% apple juice',
  },
  {
    id: 'coffee',
    name: 'Premium Roast Coffee',
    category: 'drinks',
    price: 1.49,
    description: 'Hot, freshly brewed coffee',
  },

  // Desserts
  {
    id: 'mcflurry-oreo',
    name: 'McFlurry with OREO',
    category: 'desserts',
    price: 3.99,
    description: 'Creamy vanilla soft serve with OREO cookie pieces',
  },
  {
    id: 'mcflurry-mnm',
    name: "McFlurry with M&M'S",
    category: 'desserts',
    price: 3.99,
    description: "Creamy vanilla soft serve with M&M'S chocolate candies",
  },
  {
    id: 'apple-pie',
    name: 'Baked Apple Pie',
    category: 'desserts',
    price: 1.89,
    description: 'Warm apple pie with a crispy, golden crust',
  },
  {
    id: 'ice-cream-cone',
    name: 'Vanilla Cone',
    category: 'desserts',
    price: 1.29,
    description: 'Creamy vanilla soft serve in a cone',
  },
];

export const CATEGORY_NAMES: Record<string, string> = {
  burgers: '🍔 Burgers',
  chicken: '🍗 Chicken & Sandwiches',
  breakfast: '🍳 Breakfast',
  sides: '🍟 Sides',
  drinks: '🥤 Drinks',
  desserts: '🍦 Desserts',
};
