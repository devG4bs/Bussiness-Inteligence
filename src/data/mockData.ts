// Dados para o gráfico de linha (Gastos mensais)
export const salesData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  datasets: [
    {
      label: 'Gastos 2023',
      data: [2800, 3100, 2750, 3200, 2900, 3400, 2950, 3100, 3300, 2800, 3500, 3700],
      borderColor: '#00E396',
      backgroundColor: 'rgba(0, 227, 150, 0.5)',
    },
    {
      label: 'Receita 2023',
      data: [4500, 4500, 4500, 5000, 5000, 5000, 5000, 5000, 5500, 5500, 5500, 5500],
      borderColor: '#0084FF',
      backgroundColor: 'rgba(0, 132, 255, 0.1)',
    }
  ],
};

// Dados para o gráfico de barras (Categorias de gastos)
export const marketingData = {
  labels: ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Cartão de Crédito'],
  datasets: [
    {
      label: 'Gastos por Categoria (R$)',
      data: [1200, 800, 400, 350, 300, 250, 1500],
      backgroundColor: [
        'rgba(0, 227, 150, 0.8)',
        'rgba(0, 143, 251, 0.8)',
        'rgba(254, 176, 25, 0.8)',
        'rgba(255, 69, 96, 0.8)',
        'rgba(119, 93, 208, 0.8)',
        'rgba(0, 183, 195, 0.8)',
        'rgba(255, 99, 132, 0.8)',
      ],
    },
  ],
};

// Dados para o gráfico de pizza (Distribuição de gastos)
export const financialData = {
  labels: ['Essenciais', 'Lazer', 'Investimentos', 'Dívidas'],
  datasets: [
    {
      label: 'Distribuição de Gastos',
      data: [65, 15, 10, 10],
      backgroundColor: [
        'rgba(0, 227, 150, 0.8)',
        'rgba(0, 143, 251, 0.8)',
        'rgba(254, 176, 25, 0.8)',
        'rgba(255, 69, 96, 0.8)',
      ],
    },
  ],
};

// Dados para o histórico de faturas do cartão
export const creditCardData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  datasets: [
    {
      label: 'Fatura do Cartão',
      data: [1200, 1350, 980, 1500, 1100, 1400, 1250, 1300, 1500, 1200, 1600, 1800],
      borderColor: '#FF4560',
      backgroundColor: 'rgba(255, 69, 96, 0.5)',
    },
  ],
}; 