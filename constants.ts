
import { Product, User } from './types';

export const APP_NAME = "Adega 1000 Grau";

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'admin',
    role: 'admin',
    pin: '1234'
  },
  {
    id: 'u2',
    name: 'gerente',
    role: 'gerente',
    pin: '0000'
  },
  {
    id: 'u3',
    name: 'caixa',
    role: 'caixa',
    pin: '1111'
  }
];

export const INITIAL_CATEGORIES = [
  'Vinho',
  'Cerveja',
  'Destilado',
  'Água/Refr',
  'Petiscos',
  'Kits'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vinho Tinto Malbec Reserva',
    category: 'Vinho',
    price: 89.90,
    cost: 45.00,
    stock: 24,
    minStock: 10,
    description: 'Vinho encorpado com notas de frutas vermelhas e carvalho.',
    barcode: '789123456001'
  },
  {
    id: '2',
    name: 'Cerveja Artesanal IPA 500ml',
    category: 'Cerveja',
    price: 22.50,
    cost: 12.00,
    stock: 48,
    minStock: 24,
    description: 'Amargor pronunciado e aroma cítrico.',
    barcode: '789123456002'
  },
  {
    id: '3',
    name: 'Whisky 12 Anos Single Malt',
    category: 'Destilado',
    price: 250.00,
    cost: 150.00,
    stock: 5,
    minStock: 3,
    description: 'Sabor defumado suave e final longo.',
    barcode: '789123456003'
  },
  {
    id: '4',
    name: 'Água com Gás 500ml',
    category: 'Água/Refr',
    price: 4.50,
    cost: 1.50,
    stock: 100,
    minStock: 50,
    description: 'Água mineral natural gaseificada.',
    barcode: '789123456004'
  },
  {
    id: '5',
    name: 'Vinho Branco Sauvignon Blanc',
    category: 'Vinho',
    price: 65.00,
    cost: 32.00,
    stock: 15,
    minStock: 8,
    description: 'Refrescante, acidez equilibrada e notas de maracujá.',
    barcode: '789123456005'
  },
  {
    id: '6',
    name: 'Gin London Dry',
    category: 'Destilado',
    price: 120.00,
    cost: 70.00,
    stock: 8,
    minStock: 5,
    description: 'Clássico gin seco, ideal para drinks.',
    barcode: '789123456006'
  }
];