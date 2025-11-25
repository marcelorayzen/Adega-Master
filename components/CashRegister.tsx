
import React, { useState } from 'react';
import { CashRegisterStatus, User } from '../types';
import { Lock, Unlock, TrendingUp, User as UserIcon, Calendar, AlertCircle } from 'lucide-react';

interface CashRegisterProps {
  status: CashRegisterStatus;
  currentUser: User | null;
  onOpen: (initialAmount: number) => void;
  onClose: () => void;
}

const CashRegister: React.FC<CashRegisterProps> = ({ status, currentUser, onOpen, onClose }) => {
  const [initialAmount, setInitialAmount] = useState('');

  const handleOpen = () => {
    const amount = parseFloat(initialAmount);
    if (!isNaN(amount) && amount >= 0) {
      onOpen(amount);
      setInitialAmount('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Status */}
        <div className={`p-6 text-center text-white transition-colors duration-300 ${status.isOpen ? 'bg-green-600' : 'bg-gray-800'}`}>
          <div className="inline-block p-3 bg-white/10 rounded-full mb-3">
             {status.isOpen ? <Unlock size={32} /> : <Lock size={32} />}
          </div>
          <h2 className="text-2xl font-bold">{status.isOpen ? 'Caixa Aberto' : 'Caixa Fechado'}</h2>
          <p className="opacity-90 mt-1 text-sm">
            {status.isOpen 
              ? `Aberto por: ${status.openedBy || 'Sistema'}` 
              : 'Aguardando abertura para iniciar vendas'}
          </p>
        </div>

        <div className="p-8">
          {status.isOpen ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Saldo em Caixa</p>
                <div className="text-5xl font-bold text-gray-800 tracking-tight">R$ {status.balance.toFixed(2)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
                    <Calendar size={20} className="mx-auto text-blue-500 mb-1" />
                    <p className="text-xs text-blue-800 font-medium">Abertura</p>
                    <p className="font-bold text-blue-900">{new Date(status.openedAt!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                 </div>
                 <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-center">
                    <UserIcon size={20} className="mx-auto text-purple-500 mb-1" />
                    <p className="text-xs text-purple-800 font-medium">Operador</p>
                    <p className="font-bold text-purple-900 truncate px-1">{status.openedBy}</p>
                 </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3 items-start">
                  <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                  <p className="text-xs text-yellow-800">
                    Ao fechar, o sistema gerará automaticamente o relatório de movimentações do dia (Z).
                  </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 mt-4"
              >
                <Lock size={20} /> Fechar Caixa e Emitir Z
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg mb-4">
                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon size={20} className="text-gray-600" />
                 </div>
                 <div>
                    <p className="text-xs text-gray-500">Operador Atual</p>
                    <p className="font-medium text-gray-800">{currentUser?.name}</p>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fundo de Troco (Abertura)</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-green-600 transition-colors">R$</span>
                  <input
                    type="number"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-lg font-medium"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              </div>
              
              <button 
                onClick={handleOpen}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
              >
                <Unlock size={20} /> Confirmar Abertura
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashRegister;
