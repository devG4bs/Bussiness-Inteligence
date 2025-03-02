# Controle de Finanças Pessoais

Um aplicativo moderno para controle de finanças pessoais com gráficos interativos e design elegante.

## Características

- Interface moderna e responsiva
- Gráficos interativos com animações
- Tema escuro com detalhes em cores vibrantes
- Acompanhamento de receitas e despesas
- Controle de faturas de cartão de crédito
- Visualização de economia e saldo atual
- Distribuição de gastos por categoria
- Filtros de data para análise temporal
- **Adição de gastos diretamente no aplicativo**
- **Integração com WhatsApp para registro de despesas**
- **Atualização automática dos gráficos ao adicionar despesas**

## Tecnologias Utilizadas

- React
- TypeScript
- Chart.js
- React-Chartjs-2
- CSS Moderno (Flexbox e Grid)
- Parcel (bundler)
- LocalStorage para persistência de dados

## Instalação

Para instalar as dependências do projeto, execute:

```bash
npm install
```

## Execução

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```

O aplicativo estará disponível em `http://localhost:1234`.

## Como Adicionar Gastos

### Método 1: Diretamente no Aplicativo

1. Clique no botão "+ Adicionar Despesa"
2. Preencha os campos:
   - Descrição (ex: "Supermercado", "Aluguel")
   - Valor (em R$)
   - Categoria (selecione entre as opções disponíveis)
   - Data
3. Clique em "Salvar"

Suas despesas serão salvas localmente no navegador e aparecerão na seção "Despesas Recentes". Os gráficos serão automaticamente atualizados para refletir suas novas despesas.

### Método 2: Via WhatsApp

1. Na seção "Integração com WhatsApp", insira seu número de telefone
2. Clique em "Conectar"
3. Envie mensagens no formato: `Gasto: [valor] [categoria] [descrição]`
   - Exemplo: `Gasto: 45,90 Alimentação Almoço no restaurante`

Assim como no método direto, os gráficos serão atualizados automaticamente quando você adicionar despesas via WhatsApp.

**Nota:** A integração com WhatsApp é uma simulação. Em um ambiente de produção, seria necessário implementar um serviço de backend para processar as mensagens do WhatsApp.

## Atualização dos Gráficos

Quando você adiciona uma nova despesa, os seguintes gráficos são atualizados automaticamente:

1. **Receitas vs. Despesas**: Atualiza o valor de despesas do mês atual
2. **Gastos por Categoria**: Atualiza os valores de cada categoria com base nas suas despesas
3. **Distribuição de Gastos**: Recalcula a distribuição percentual entre gastos essenciais, lazer, investimentos e dívidas
4. **Histórico de Faturas do Cartão**: Atualiza as faturas do cartão de crédito se a despesa for dessa categoria

Os gráficos incluem uma animação sutil para destacar quando foram atualizados.

## Construção para Produção

Para construir o aplicativo para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist`.

## Estrutura do Projeto

```
financas-pessoais/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   └── PieChart.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── KPICard.tsx
│   │   ├── ExpenseForm.tsx
│   │   └── WhatsAppIntegration.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── styles/
│   │   ├── global.css
│   │   ├── App.css
│   │   ├── Header.css
│   │   ├── Dashboard.css
│   │   ├── KPICard.css
│   │   ├── ExpenseForm.css
│   │   └── Charts.css
│   ├── App.tsx
│   └── index.tsx
├── index.html
├── package.json
└── README.md
```

## Personalização

O aplicativo pode ser facilmente personalizado através dos arquivos CSS na pasta `src/styles/`. As cores principais e variáveis de design estão definidas no arquivo `global.css`.

## Dados

Atualmente, o aplicativo utiliza dados de exemplo definidos em `src/data/mockData.ts`. Para usar seus dados reais, você pode:

1. Editar diretamente o arquivo mockData.ts com seus valores
2. Adicionar despesas através do formulário no aplicativo
3. Usar a integração com WhatsApp (simulada)

## Próximos Passos

- Implementar backend real para processamento de mensagens do WhatsApp
- Adicionar autenticação de usuários
- Implementar sistema de metas financeiras
- Adicionar relatórios mensais e anuais
- Desenvolver versão mobile do aplicativo
- Adicionar importação de extratos bancários

---

Desenvolvido para ajudar no controle e planejamento financeiro pessoal. # Bussiness-Inteligence
