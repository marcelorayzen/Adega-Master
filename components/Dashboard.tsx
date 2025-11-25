
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Product, Sale, PaymentMethod } from '../types';
import { AlertTriangle, TrendingUp, DollarSign, Package } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  cashBalance: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

// Cores para os métodos de pagamento
const PAYMENT_COLORS: Record<string, string> = {
  [PaymentMethod.CASH]: '#22c55e', // Green
  [PaymentMethod.PIX]: '#a855f7',  // Purple
  [PaymentMethod.CREDIT]: '#3b82f6', // Blue
  [PaymentMethod.DEBIT]: '#60a5fa',  // Light Blue
};

const Dashboard: React.FC<DashboardProps> = ({ products, sales, cashBalance }) => {
  
  // Calculate Stats
  const totalSalesValue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  
  // Prepare Chart Data (Grouped by Date AND Payment Method)
  // Estrutura: { date: '24/11', 'Dinheiro': 100, 'Pix': 50 }
  const salesByDateAndMethod = sales.reduce((acc: Record<string, any>, sale) => {
    const date = new Date(sale.date).toLocaleDateString();
    
    if (!acc[date]) {
      acc[date] = { date };
    }
    
    // Soma o valor para o método de pagamento específico naquele dia
    acc[date][sale.paymentMethod] = (acc[date][sale.paymentMethod] || 0) + sale.total;
    
    return acc;
  }, {});
  
  // Converte objeto em array e pega os últimos 7 dias
  const barChartData = Object.values(salesByDateAndMethod).slice(-7);

  const categoryData = products.reduce((acc: any, prod) => {
    acc[prod.category] = (acc[prod.category] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryData).map(cat => ({
    name: cat,
    value: categoryData[cat]
  }));

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Gerencial</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Vendas Totais</p>
            <p className="text-xl font-bold text-gray-800">R$ {totalSalesValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Produtos Ativos</p>
            <p className="text-xl font-bold text-gray-800">{products.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Estoque Baixo</p>
            <p className="text-xl font-bold text-gray-800">{lowStockProducts.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Saldo em Caixa (Dinheiro)</p>
            <p className="text-xl font-bold text-gray-800">R$ {cashBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart (Stacked by Payment) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Vendas Recentes (por Pagamento)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [`R$ ${value.toFixed(2)}`, name]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{fill: 'transparent'}}
                />
                <Legend />
                {Object.values(PaymentMethod).map((method) => (
                  <Bar 
                    key={method} 
                    dataKey={method} 
                    stackId="a" 
                    fill={PAYMENT_COLORS[method] || '#cbd5e1'} 
                    radius={[0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Mix de Produtos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low Stock Alert List */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <h3 className="text-red-800 font-semibold mb-2 flex items-center">
            <AlertTriangle className="mr-2" size={20} /> Atenção: Reposição Necessária
          </h3>
          <ul className="list-disc list-inside text-red-700">
            {lowStockProducts.map(p => (
              <li key={p.id}>{p.name} - Restam apenas {p.stock} unidades (Mín: {p.minStock})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
