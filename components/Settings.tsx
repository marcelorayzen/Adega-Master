
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Plus, Trash2, Shield, Tag, UserPlus } from 'lucide-react';

interface SettingsProps {
  categories: string[];
  onAddCategory: (cat: string) => void;
  onRemoveCategory: (cat: string) => void;
  users: User[];
  onAddUser: (user: User) => void;
  onRemoveUser: (userId: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  categories, onAddCategory, onRemoveCategory,
  users, onAddUser, onRemoveUser 
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'users'>('categories');
  const [newCategory, setNewCategory] = useState('');
  
  // User Form
  const [newUser, setNewUser] = useState({ name: '', role: 'caixa' as UserRole, pin: '' });

  const handleAddCat = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.name && newUser.pin) {
      onAddUser({
        id: Math.random().toString(36).substr(2, 9),
        ...newUser
      });
      setNewUser({ name: '', role: 'caixa', pin: '' });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações</h2>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('categories')}
          className={`pb-2 px-4 font-medium flex items-center gap-2 ${activeTab === 'categories' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
        >
          <Tag size={18} /> Categorias
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-4 font-medium flex items-center gap-2 ${activeTab === 'users' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
        >
          <Shield size={18} /> Equipe
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        
        {activeTab === 'categories' && (
          <div>
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nova Categoria (ex: Charutos)"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
              />
              <button 
                onClick={handleAddCat}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus size={18} /> Adicionar
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map(cat => (
                <div key={cat} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="font-medium text-gray-700">{cat}</span>
                  <button onClick={() => onRemoveCategory(cat)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <form onSubmit={handleAddUser} className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><UserPlus size={18}/> Novo Usuário</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input required placeholder="Nome do Usuário" className="p-2 border rounded" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                <select className="p-2 border rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                  <option value="caixa">Caixa</option>
                  <option value="gerente">Gerente</option>
                  <option value="admin">Admin</option>
                </select>
                <input required placeholder="Senha/PIN" type="password" className="p-2 border rounded" value={newUser.pin} onChange={e => setNewUser({...newUser, pin: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Cadastrar Funcionário</button>
            </form>

            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                       {user.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <div className="font-medium text-gray-800">{user.name}</div>
                       <div className="text-xs text-gray-500 uppercase font-semibold text-purple-600">{user.role}</div>
                     </div>
                  </div>
                  {user.role !== 'admin' && (
                    <button onClick={() => onRemoveUser(user.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;