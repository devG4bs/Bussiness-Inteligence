# Atualização Automática de Gráficos

Este documento explica como funciona o sistema de atualização automática de gráficos no aplicativo de controle financeiro pessoal.

## Visão Geral

O aplicativo atualiza automaticamente todos os gráficos quando uma nova despesa é adicionada, seja diretamente pelo formulário ou através da integração com WhatsApp. Isso proporciona uma visualização em tempo real do impacto de cada despesa no seu orçamento.

## Como Funciona

Quando uma nova despesa é adicionada, o sistema executa os seguintes passos:

1. A despesa é adicionada ao array de despesas no estado do componente Dashboard
2. A função `updateChartsWithExpenses` é chamada com o array atualizado
3. Cada gráfico é atualizado com base nos novos dados
4. Uma animação visual é aplicada para destacar a atualização
5. Uma mensagem de confirmação é exibida ao usuário

## Detalhes Técnicos

### Atualização do Gráfico de Linha (Receitas vs. Despesas)

```typescript
// Atualizar gráfico de linha (salesData)
const updatedSalesData = { ...salesData };
const currentMonth = new Date().getMonth(); // 0-11 para Jan-Dez

// Calcular o total de despesas do mês atual
const currentMonthExpenses = currentExpenses.reduce((total, expense) => {
  const expenseMonth = new Date(expense.date).getMonth();
  if (expenseMonth === currentMonth) {
    return total + expense.amount;
  }
  return total;
}, 0);

// Atualizar o valor do mês atual no gráfico
updatedSalesData.datasets[0].data[currentMonth] = currentMonthExpenses;
setSalesData(updatedSalesData);
```

Este código calcula o total de despesas do mês atual e atualiza o valor correspondente no gráfico de linha.

### Atualização do Gráfico de Barras (Gastos por Categoria)

```typescript
// Atualizar gráfico de barras (marketingData)
const updatedMarketingData = { ...marketingData };
const categoryCounts: {[key: string]: number} = {};

// Inicializar categorias com zero
marketingData.labels.forEach((label, index) => {
  categoryCounts[label] = 0;
});

// Somar despesas por categoria
currentExpenses.forEach(expense => {
  if (categoryCounts[expense.category] !== undefined) {
    categoryCounts[expense.category] += expense.amount;
  }
});

// Atualizar os dados do gráfico de barras
updatedMarketingData.datasets[0].data = marketingData.labels.map(label => 
  categoryCounts[label] || 0
);
setMarketingData(updatedMarketingData);
```

Este código soma as despesas por categoria e atualiza o gráfico de barras com os novos valores.

### Atualização do Gráfico de Pizza (Distribuição de Gastos)

```typescript
// Atualizar gráfico de pizza (financialData)
// Classificar despesas em categorias mais amplas
const essentialCategories = ['Moradia', 'Alimentação', 'Saúde', 'Educação'];
const leisureCategories = ['Lazer'];
const debtCategories = ['Cartão de Crédito'];

let essentialTotal = 0;
let leisureTotal = 0;
let investmentTotal = 0; // Mantemos o valor original para investimentos
let debtTotal = 0;

currentExpenses.forEach(expense => {
  if (essentialCategories.includes(expense.category)) {
    essentialTotal += expense.amount;
  } else if (leisureCategories.includes(expense.category)) {
    leisureTotal += expense.amount;
  } else if (debtCategories.includes(expense.category)) {
    debtTotal += expense.amount;
  }
});

// Manter o valor original para investimentos
investmentTotal = initialFinancialData.datasets[0].data[2];

const totalAmount = essentialTotal + leisureTotal + investmentTotal + debtTotal;

if (totalAmount > 0) {
  const updatedFinancialData = { ...financialData };
  updatedFinancialData.datasets[0].data = [
    Math.round((essentialTotal / totalAmount) * 100),
    Math.round((leisureTotal / totalAmount) * 100),
    Math.round((investmentTotal / totalAmount) * 100),
    Math.round((debtTotal / totalAmount) * 100)
  ];
  setFinancialData(updatedFinancialData);
}
```

Este código classifica as despesas em categorias mais amplas (essenciais, lazer, investimentos e dívidas) e atualiza o gráfico de pizza com a nova distribuição percentual.

### Atualização do Gráfico de Faturas do Cartão

```typescript
// Atualizar gráfico de faturas do cartão (creditCardData)
const updatedCreditCardData = { ...creditCardData };
const cardExpenses = currentExpenses.filter(expense => 
  expense.category === 'Cartão de Crédito'
);

if (cardExpenses.length > 0) {
  const cardExpensesByMonth: number[] = Array(12).fill(0);
  
  cardExpenses.forEach(expense => {
    const expenseMonth = new Date(expense.date).getMonth();
    cardExpensesByMonth[expenseMonth] += expense.amount;
  });
  
  // Atualizar apenas os meses que têm despesas de cartão
  cardExpensesByMonth.forEach((amount, month) => {
    if (amount > 0) {
      updatedCreditCardData.datasets[0].data[month] = amount;
    }
  });
  
  setCreditCardData(updatedCreditCardData);
}
```

Este código filtra as despesas da categoria "Cartão de Crédito", soma por mês e atualiza o gráfico de linha das faturas do cartão.

## Animação de Atualização

Para destacar visualmente quando um gráfico é atualizado, aplicamos uma animação CSS:

```css
@keyframes chartUpdate {
  0% {
    opacity: 0.7;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.chart-update-animation {
  animation: chartUpdate 0.5s ease-in-out;
}
```

Esta animação é aplicada ao container do gráfico quando os dados são atualizados, criando um efeito sutil de "pulso" que chama a atenção do usuário para a mudança.

## Considerações de Desempenho

- A atualização dos gráficos é otimizada para evitar re-renderizações desnecessárias
- Usamos o hook `useEffect` para detectar mudanças nos dados
- A animação é aplicada apenas durante a atualização e tem duração curta (500ms)
- Os cálculos são feitos apenas para os dados relevantes (ex: apenas o mês atual para despesas)

## Próximos Passos

- Implementar filtros para visualizar dados de períodos específicos
- Adicionar opção para desativar animações
- Criar visualizações comparativas (mês atual vs. mês anterior)
- Implementar previsões baseadas em tendências de gastos 