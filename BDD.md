
# Especificação de Comportamento (BDD)

## Funcionalidade: Controle de Caixa
**Como** um operador de loja  
**Quero** poder abrir e fechar o caixa  
**Para** controlar o fluxo financeiro do dia

### Cenário: Abertura de Caixa com Sucesso
**Dado** que o caixa está com status "Fechado"
**E** eu estou logado como operador "Caixa 01"
**Quando** eu acesso a tela "Caixa"
**E** informo o valor de fundo de troco de R$ 100,00
**E** confirmo a abertura
**Então** o status do caixa deve mudar para "Aberto"
**E** o sistema deve registrar a data e hora da abertura
**E** o sistema deve liberar o acesso à tela de PDV

### Cenário: Fechamento de Caixa
**Dado** que o caixa está "Aberto"
**E** foram realizadas vendas totalizando R$ 500,00
**Quando** eu clico em "Fechar Caixa"
**Então** o sistema deve exibir um resumo com o saldo final esperado (Fundo + Vendas)
**E** o status deve mudar para "Fechado"

---

## Funcionalidade: Ponto de Venda (PDV)
**Como** um vendedor  
**Quero** registrar vendas de produtos  
**Para** atender os clientes rapidamente

### Cenário: Venda Simples
**Dado** que o caixa está aberto
**E** existe o produto "Vinho Tinto" com estoque de 10 unidades e preço R$ 50,00
**Quando** eu adiciono 2 unidades de "Vinho Tinto" ao carrinho
**E** seleciono a forma de pagamento "Pix"
**E** finalizo a venda
**Então** o total da venda deve ser R$ 100,00
**E** o estoque do produto deve ser atualizado para 8 unidades
**E** o saldo do caixa deve ser incrementado em R$ 100,00

### Cenário: Tentativa de Venda sem Estoque
**Dado** que o produto "Whisky" tem 0 unidades em estoque
**Quando** eu tento adicionar "Whisky" ao carrinho
**Então** o botão de adicionar deve estar desabilitado
**E** o sistema não deve permitir a inclusão do item

---

## Funcionalidade: Gestão de Estoque
**Como** um gerente  
**Quero** cadastrar novos produtos
**Para** manter o catálogo atualizado

### Cenário: Cadastro de Novo Produto
**Dado** que estou logado com perfil de "Gerente" ou "Admin"
**Quando** acesso a tela "Produtos"
**E** clico em "Novo Produto"
**E** preencho Nome="Cerveja IPA", Preço=15.00, Estoque=50
**E** salvo o registro
**Então** o produto "Cerveja IPA" deve aparecer na listagem de estoque
**E** deve estar disponível para venda no PDV
