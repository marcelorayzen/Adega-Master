
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not set in environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getSmartRecommendation = async (
  query: string,
  inventory: Product[]
): Promise<string> => {
  const ai = createClient();
  if (!ai) {
    return "Erro de configuração: Chave de API não encontrada.";
  }

  // Create a simplified inventory list to save tokens and focus context
  const inventoryContext = inventory.map(p => 
    `- ${p.name}: ${p.category}, R$${p.price.toFixed(2)}, Qtd: ${p.stock}`
  ).join('\n');

  const systemInstruction = `
    Você é o Sommelier Virtual da "Adega Master".
    Use APENAS o estoque abaixo para recomendar produtos.
    
    Estoque Atual:
    ${inventoryContext}
    
    Regras:
    1. Se não tiver o item exato, sugira algo do mesmo estilo que esteja na lista.
    2. Resposta curta e vendedora (máx 3 frases).
    3. Formatação Markdown limpa.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Desculpe, não consegui formular uma recomendação no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao conectar com o Sommelier Virtual.";
  }
};
