
import React, { useState } from 'react';
import { Product } from '../types';
import { Edit2, Search, PlusCircle, Save, X, Barcode } from 'lucide-react';
import ProductIcon from './ProductIcon';

interface InventoryProps {
  products: Product[];
  categories: string[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, categories, onUpdateProduct, onAddProduct }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Empty state for new product
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      barcode: '',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 5,
      category: categories[0] || 'Geral',
      description: ''
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;
    
    if (isAdding) {
      const newProduct: Product = {
        ...formData as Product,
        id: Math.random().toString(36).substr(2, 9),
      };
      onAddProduct(newProduct);
      setIsAdding(false);
    } else if (editingId) {
      onUpdateProduct(formData as Product);
      setEditingId(null);
    }
    setFormData({});
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.barcode && p.barcode.includes(searchTerm))
  );

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h2>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <PlusCircle size={20} /> Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
           <Search className="text-gray-400 mr-2" size={20} />
           <input 
             type="text" 
             placeholder="Buscar por nome ou código de barras..." 
             className="bg-transparent border-none focus:outline-none w-full text-gray-600"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        {/* Edit/Add Form Inline */}
        {(isAdding || editingId) && (
          <div className="p-6 bg-purple-50 border-b border-purple-100 animate-fade-in">
             <h3 className="text-purple-900 font-semibold mb-3">{isAdding ? 'Novo Produto' : 'Editar Produto'}</h3>
             
             {/* Row 1: Barcode, Name, Category */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-1">
                    <label className="text-xs text-purple-700 font-medium ml-1 flex items-center gap-1">
                      <Barcode size={12}/> Cód. Barras
                    </label>
                    <input 
                      className="w-full p-2 rounded border border-purple-200 focus:border-purple-500 outline-none" 
                      placeholder="EAN / Código" 
                      value={formData.barcode || ''} 
                      onChange={e => setFormData({...formData, barcode: e.target.value})} 
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="text-xs text-purple-700 font-medium ml-1">Nome</label>
                    <input 
                      className="w-full p-2 rounded border border-purple-200 focus:border-purple-500 outline-none" 
                      placeholder="Nome do Produto" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="text-xs text-purple-700 font-medium ml-1">Categoria</label>
                    <select 
                      className="w-full p-2 rounded border border-purple-200 focus:border-purple-500 outline-none bg-white"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
             </div>
             
             {/* Row 2: Prices and Stock */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs text-purple-700 font-medium ml-1">Custo (R$)</label>
                  <input type="number" className="w-full p-2 rounded border border-purple-200 focus:border-purple-500 outline-none" placeholder="0.00" value={formData.cost} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs text-purple-700 font-medium ml-1">Venda (R$)</label>
                  <input type="number" className="w-full p-2 rounded border border-purple-200 focus:border-purple-500 outline-none" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                </div>
                 <div>
                    <label className="text-xs text-purple-700 font-medium ml-1">Estoque</label>
                    <input type="number" className="w-full p-2 rounded border border-purple-200" placeholder="Qtd" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
                 </div>
                 <div>
                    <label className="text-xs text-purple-700 font-medium ml-1">Estoque Mín.</label>
                    <input type="number" className="w-full p-2 rounded border border-purple-200" placeholder="Min" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})} />
                 </div>
             </div>

             <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-purple-200">
               <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-gray-600 hover:bg-white rounded transition-colors">Cancelar</button>
               <button onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2 shadow-sm transition-colors">
                 <Save size={16} /> Salvar
               </button>
             </div>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                <th className="p-4 bg-gray-50">Produto</th>
                <th className="p-4 bg-gray-50">Categoria</th>
                <th className="p-4 text-right bg-gray-50">Custo</th>
                <th className="p-4 text-right bg-gray-50">Venda</th>
                <th className="p-4 text-center bg-gray-50">Estoque</th>
                <th className="p-4 text-right bg-gray-50">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <ProductIcon category={product.category} size={32} className="w-10 h-10 bg-gray-100 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-800">{product.name}</div>
                        <div className="text-xs text-gray-400 font-mono flex items-center gap-1">
                          {product.barcode ? <><Barcode size={10}/> {product.barcode}</> : 'S/N'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-right text-gray-400 text-sm">R$ {product.cost.toFixed(2)}</td>
                  <td className="p-4 text-right font-medium text-gray-800">R$ {product.price.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded font-bold text-xs ${product.stock <= product.minStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;