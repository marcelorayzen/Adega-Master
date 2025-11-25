
import React, { useState } from 'react';
import { User } from '../types';
import { Wine, Lock, User as UserIcon } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Comparação simples (case-insensitive para nome)
    const user = users.find(u => u.name.toLowerCase() === username.toLowerCase() && u.pin === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciais inválidas. Tente admin / 1234');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-purple-900 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-700 rounded-full mb-4 shadow-lg">
            <Wine className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">{APP_NAME}</h1>
          <p className="text-purple-200 mt-2">Acesso Restrito</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                placeholder="Ex: admin"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha (PIN)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                placeholder="****"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            Entrar
          </button>
          
          <div className="text-center text-xs text-gray-400 mt-4">
            Dica: admin / 1234
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;