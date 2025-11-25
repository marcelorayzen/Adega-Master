
export type UserRole = 'admin' | 'gerente' | 'caixa';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  pin?: string; // Simulação de senha
}

export interface Product {
  id: string;
  name: string;
  category: string; // Mudado de Enum para string para permitir categorias dinâmicas
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  description?: string;
  barcode?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum PaymentMethod {
  CASH = 'Dinheiro',
  CREDIT = 'Crédito',
  DEBIT = 'Débito',
  PIX = 'Pix',
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  date: string; // ISO string
  paymentMethod: PaymentMethod;
  operatorId: string;
}

export interface CashRegisterStatus {
  isOpen: boolean;
  balance: number;
  openedAt?: string;
  openedBy?: string;
}

export enum AppView {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  POS = 'pos',
  INVENTORY = 'inventory',
  CASHIER = 'cashier',
  SETTINGS = 'settings'
}
