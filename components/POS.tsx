
import React, { useState } from 'react';
import { Product, CartItem, PaymentMethod } from '../types';
import { Plus, Minus, Trash2, ShoppingCart, Search } from 'lucide-react';
import ProductIcon from './ProductIcon';

interface POSProps {
  products: Product[];
  categories: string[];
  onSaleComplete: (items: CartItem[], total: number, method: PaymentMethod) => void;
  isRegisterOpen: boolean;
}

const POS: React.FC<POSProps> = ({ products, categories, onSaleComplete, isRegisterOpen }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [isProcessing, setIsProcessing] = useState(false);

  const displayCategories = ['Todos', ...categories];

  const addToCart = (product: Product) => {
    if (!isRegisterOpen) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      onSaleComplete(cart, cartTotal, selectedPayment);
      setCart([]);
      setIsProcessing(false);
    }, 1000);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isRegisterOpen) {
    return (
      <div className="flex h-full items-center justify-center flex-col text-gray-500 animate-fade-in">
        <div className="bg-gray-200 p-6 rounded-full mb-4">
          <ShoppingCart size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700">Caixa Fechado</h2>
        <p className="text-gray-500">Abra o caixa no menu "Caixa" para iniciar.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-screen overflow-hidden">
      {/* Product Catalog */}
      <div className="flex-1 p-4 md:p-6 flex flex-col bg-gray-50 overflow-hidden">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Buscar produto ou código de barras..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {displayCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Updated Grid: Supports xl:grid-cols-5 now that sidebar is narrow */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pr-2 pb-20">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col text-left group relative ${product.stock === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="aspect-square w-full bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <ProductIcon category={product.category} size={48} className="w-full h-full bg-gray-50" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-800 mt-2 text-sm line-clamp-2 leading-tight min-h-[2.5rem]">{product.name}</h3>
              </div>
              <div className="mt-3 flex justify-between items-end w-full">
                <span className="text-lg font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                <span className={`text-xs ${product.stock < 5 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                   {product.stock} un
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart / Checkout Sidebar */}
      <div className="w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-20 flex-shrink-0">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <ShoppingCart className="mr-2 text-purple-600" size={24} /> Carrinho
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart size={48} className="mb-2 opacity-20" />
              <p>Carrinho vazio</p>
              <p className="text-sm">Selecione produtos ao lado</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                  <div className="text-xs text-gray-500 mt-1">R$ {item.price.toFixed(2)} un</div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                     <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-200 text-gray-600 rounded-l-lg"><Minus size={14}/></button>
                     <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                     <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-200 text-gray-600 rounded-r-lg"><Plus size={14}/></button>
                   </div>
                   <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Itens</span>
              <span>{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900">
              <span>Total</span>
              <span>R$ {cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.values(PaymentMethod).map(method => (
              <button
                key={method}
                onClick={() => setSelectedPayment(method)}
                className={`py-2 text-sm rounded-lg font-medium border transition-all ${
                  selectedPayment === method 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] ${
              cart.length === 0 || isProcessing
                ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-green-600 hover:bg-green-700 hover:shadow-green-200'
            }`}
          >
            {isProcessing ? 'Processando...' : 'Finalizar Venda'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
