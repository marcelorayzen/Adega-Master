
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, DollarSign, LogOut, Menu, X, Settings as SettingsIcon
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import CashRegister from './components/CashRegister';
import Login from './components/Login';
import Settings from './components/Settings';
import { AppView, Product, Sale, CashRegisterStatus, CartItem, PaymentMethod, User } from './types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_CATEGORIES, APP_NAME } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle

  // --- Global State ---
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [sales, setSales] = useState<Sale[]>([]);
  
  const [registerStatus, setRegisterStatus] = useState<CashRegisterStatus>({
    isOpen: false,
    balance: 0
  });

  // --- Handlers ---
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Se for caixa, não mostra o dashboard, vai direto para a tela de caixa
    if (loggedInUser.role === 'caixa') {
      setCurrentView(AppView.CASHIER);
    } else {
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LOGIN);
  };

  const handleOpenRegister = (amount: number) => {
    setRegisterStatus({
      isOpen: true,
      balance: amount,
      openedAt: new Date().toISOString(),
      openedBy: user?.name || 'Desconhecido'
    });
    alert("Caixa aberto com sucesso!");
    setCurrentView(AppView.POS);
  };

  const handleCloseRegister = () => {
    const finalBalance = registerStatus.balance;
    const openedBy = registerStatus.openedBy;
    setRegisterStatus({
      isOpen: false,
      balance: 0,
      openedBy: undefined
    });
    alert(`Caixa fechado.\nOperador: ${openedBy}\nSaldo final (Dinheiro na Gaveta): R$ ${finalBalance.toFixed(2)}`);
  };

  const handleSaleComplete = (items: CartItem[], total: number, method: PaymentMethod) => {
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      items,
      total,
      date: new Date().toISOString(),
      paymentMethod: method,
      operatorId: user?.id || 'unknown'
    };

    setSales(prev => [...prev, newSale]);

    // Atualiza Estoque
    setProducts(prevProducts => prevProducts.map(p => {
      const soldItem = items.find(i => i.id === p.id);
      if (soldItem) {
        return { ...p, stock: p.stock - soldItem.quantity };
      }
      return p;
    }));

    // Atualiza Saldo do Caixa (Apenas se for Dinheiro)
    // Se for Pix, Crédito ou Débito, não entra na gaveta física.
    if (method === PaymentMethod.CASH) {
      setRegisterStatus(prev => ({
        ...prev,
        balance: prev.balance + total
      }));
    }

    alert("Venda realizada com sucesso!");
  };

  // --- Management Handlers ---
  const handleUpdateProduct = (updated: Product) => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const handleAddProduct = (newProduct: Product) => setProducts(prev => [...prev, newProduct]);
  
  const handleAddCategory = (cat: string) => setCategories(prev => [...prev, cat]);
  const handleRemoveCategory = (cat: string) => setCategories(prev => prev.filter(c => c !== cat));

  const handleAddUser = (newUser: User) => setUsers(prev => [...prev, newUser]);
  const handleRemoveUser = (userId: string) => setUsers(prev => prev.filter(u => u.id !== userId));

  // --- Render Logic ---
  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        // Segurança extra caso a rota seja forçada
        if (user?.role === 'caixa') return <CashRegister status={registerStatus} currentUser={user} onOpen={handleOpenRegister} onClose={handleCloseRegister} />;
        return <Dashboard products={products} sales={sales} cashBalance={registerStatus.balance} />;
      case AppView.POS:
        return (
          <POS 
            products={products} 
            categories={categories} 
            onSaleComplete={handleSaleComplete} 
            isRegisterOpen={registerStatus.isOpen} 
          />
        );
      case AppView.INVENTORY:
        return (
          <Inventory 
            products={products} 
            categories={categories} 
            onUpdateProduct={handleUpdateProduct} 
            onAddProduct={handleAddProduct} 
          />
        );
      case AppView.CASHIER:
        return (
          <CashRegister 
            status={registerStatus} 
            currentUser={user} 
            onOpen={handleOpenRegister} 
            onClose={handleCloseRegister} 
          />
        );
      case AppView.SETTINGS:
        return (
          <Settings 
            categories={categories}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
            users={users}
            onAddUser={handleAddUser}
            onRemoveUser={handleRemoveUser}
          />
        );
      default:
        return <Dashboard products={products} sales={sales} cashBalance={registerStatus.balance} />;
    }
  };

  // --- Auth Guard ---
  if (!user) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  // --- Layout Logic ---
  // When in POS view, we shrink the sidebar on desktop to give maximum space to the cart/grid
  const isPosView = currentView === AppView.POS;
  
  // Sidebar Width: 
  // Mobile: handled by transform/translate
  // Desktop: w-64 (expanded) or w-20 (collapsed/icon-only)
  const desktopSidebarClass = isPosView ? 'lg:w-20' : 'lg:w-64';
  const labelClass = isPosView ? 'hidden' : 'hidden lg:block';

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => { 
        setCurrentView(view); 
        setIsSidebarOpen(false); // close mobile menu on click
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all mb-1 ${
        currentView === view 
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
          : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
      } ${isPosView ? 'justify-center px-0' : ''}`}
      title={isPosView ? label : ''}
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className={`font-medium whitespace-nowrap ${labelClass} md:hidden`}>
        {label}
      </span>
      {/* Show label on mobile always inside the drawer */}
      <span className={`font-medium md:hidden ${isPosView ? 'hidden' : 'block'}`}>{label}</span>
      
      {/* Show label on Desktop ONLY if not POS view */}
      <span className={`hidden ${isPosView ? 'hidden' : 'lg:block'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-30 h-full bg-white shadow-xl flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        md:w-20 ${desktopSidebarClass}
      `}>
        
        {/* Logo Area */}
        <div className={`p-6 flex items-center ${isPosView ? 'justify-center' : 'justify-between lg:justify-start lg:gap-3'}`}>
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">{APP_NAME.charAt(0)}</span>
          </div>
          <span className={`font-bold text-xl text-gray-800 ${labelClass} md:hidden`}>{APP_NAME}</span>
          <span className={`hidden ${isPosView ? 'hidden' : 'lg:block'} font-bold text-xl text-gray-800`}>{APP_NAME.split(' ')[0]}</span>
          
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {user.role !== 'caixa' && (
            <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          )}
          <NavItem view={AppView.POS} icon={ShoppingCart} label="PDV" />
          <NavItem view={AppView.INVENTORY} icon={Package} label="Produtos" />
          <NavItem view={AppView.CASHIER} icon={DollarSign} label="Caixa" />
          
          {user.role === 'admin' && (
             <NavItem view={AppView.SETTINGS} icon={SettingsIcon} label="Configurações" />
          )}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors ${isPosView ? 'justify-center' : ''}`}
            title="Sair"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`font-medium ${labelClass} md:hidden`}>Sair</span>
            <span className={`hidden ${isPosView ? 'hidden' : 'lg:block'}`}>Sair</span>
          </button>
          
          <div className={`mt-4 flex items-center ${isPosView ? 'justify-center' : 'lg:justify-start gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className={`overflow-hidden ${labelClass} md:hidden`}>
              <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
             <div className={`hidden ${isPosView ? 'hidden' : 'lg:block'} overflow-hidden`}>
              <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white shadow-sm flex items-center justify-between px-4 z-10 flex-shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-800">{APP_NAME}</span>
          <div className="w-6"></div> {/* Spacer for center alignment */}
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
