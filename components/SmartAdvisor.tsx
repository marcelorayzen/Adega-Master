import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { getSmartRecommendation } from '../services/geminiService';
import { Sparkles, Send, Bot, User, Wine } from 'lucide-react';

interface SmartAdvisorProps {
  products: Product[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SmartAdvisor: React.FC<SmartAdvisorProps> = ({ products }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o Sommelier Virtual da Adega Master. Posso ajudar você a encontrar a bebida perfeita para qualquer ocasião. O que você procura hoje?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const recommendation = await getSmartRecommendation(userMessage, products);
    
    setMessages(prev => [...prev, { role: 'assistant', content: recommendation }]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-40px)] p-6 flex flex-col max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Sparkles className="text-purple-600" /> Sommelier IA
        </h2>
        <p className="text-gray-500 mt-2">Recomendações inteligentes baseadas no seu estoque real.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-100">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : 'bg-purple-600 text-white'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Wine size={20} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gray-800 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="flex max-w-[80%] gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white">
                  <Wine size={20} />
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Vou fazer um churrasco, qual cerveja recomenda?"
              className="w-full pl-6 pr-14 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-gray-50 shadow-inner"
            />
            <button 
              type="submit" 
              disabled={!query.trim() || isLoading}
              className="absolute right-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-2">
            A IA analisa seu estoque para sugerir harmonizações e alternativas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartAdvisor;