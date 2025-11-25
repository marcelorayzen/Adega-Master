
# Adega Master - Sistema de Gestão

O **Adega Master** é uma aplicação web para gerenciamento de pequenas e médias adegas. O sistema oferece controle de estoque, ponto de venda (PDV), gestão de caixa e relatórios gerenciais em uma interface moderna e responsiva.

## 🚀 Funcionalidades

- **PDV (Ponto de Venda)**: Interface ágil para vendas, com busca por nome/código e categorias.
- **Controle de Estoque**: Cadastro, edição e visualização de produtos. Alerta de estoque baixo.
- **Gestão de Caixa**: Abertura, fechamento e controle de operador.
- **Dashboard**: Gráficos de vendas, produtos mais vendidos e faturamento.
- **Multiusuário**: Níveis de acesso para Admin, Gerente e Caixa.
- **Leve & Rápido**: Sem carregamento de imagens pesadas (uso de ícones vetoriais) e interface otimizada.

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Gráficos**: Recharts

## 📦 Como Rodar

Este projeto é uma Single Page Application (SPA).

1. Abra o arquivo `index.html` em um navegador moderno.
2. Não é necessário backend externo para testes (os dados são persistidos na memória durante a sessão).

## 🔑 Acesso Padrão

O sistema vem pré-configurado com os seguintes usuários:

- **Admin**: `admin` / `1234`
- **Gerente**: `gerente` / `0000`
- **Caixa**: `caixa` / `1111`

## 📱 Responsividade

O sistema adapta-se a dispositivos móveis e desktops. No modo Desktop, ao acessar o PDV, o menu lateral contrai automaticamente para maximizar a área de visualização dos produtos.
