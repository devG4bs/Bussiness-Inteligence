import React, { useState, useEffect } from 'react';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import KPICard from './KPICard';
import ExpenseForm from './ExpenseForm';
import '../styles/ExpensesScreen.css';

interface Expense {
  id?: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod?: string;
  isRecurring?: boolean;
}

const ExpensesScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('month');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Dados para os gráficos
  const [categoryData, setCategoryData] = useState({
    labels: ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Cartão de Crédito', 'Outros'],
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)',
        ],
      },
    ],
  });
  
  const [monthlyData, setMonthlyData] = useState({
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Despesas Mensais',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  });

  // Carregar despesas do localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setExpenses(parsedExpenses);
      setFilteredExpenses(parsedExpenses);
      updateCharts(parsedExpenses);
    }
  }, []);

  // Atualizar filtros quando as despesas mudarem
  useEffect(() => {
    applyFilters();
  }, [expenses, categoryFilter, dateFilter, searchTerm]);

  // Função para atualizar os gráficos
  const updateCharts = (expenseData: Expense[]) => {
    // Atualizar gráfico de categorias
    const categoryCounts: { [key: string]: number } = {};
    categoryData.labels.forEach(label => {
      categoryCounts[label] = 0;
    });

    expenseData.forEach(expense => {
      if (categoryCounts[expense.category] !== undefined) {
        categoryCounts[expense.category] += expense.amount;
      } else {
        categoryCounts['Outros'] += expense.amount;
      }
    });

    const updatedCategoryData = { ...categoryData };
    updatedCategoryData.datasets[0].data = categoryData.labels.map(
      label => categoryCounts[label] || 0
    );
    setCategoryData(updatedCategoryData);

    // Atualizar gráfico mensal
    const monthlyExpenses: number[] = Array(12).fill(0);
    
    expenseData.forEach(expense => {
      const expenseMonth = new Date(expense.date).getMonth();
      monthlyExpenses[expenseMonth] += expense.amount;
    });

    const updatedMonthlyData = { ...monthlyData };
    updatedMonthlyData.datasets[0].data = monthlyExpenses;
    setMonthlyData(updatedMonthlyData);
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    let filtered = [...expenses];
    
    // Filtrar por categoria
    if (categoryFilter) {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }
    
    // Filtrar por data
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    if (dateFilter === 'month') {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      });
    } else if (dateFilter === 'year') {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === currentYear;
      });
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredExpenses(filtered);
    updateCharts(filtered);
  };

  // Função para adicionar nova despesa
  const handleAddExpense = (expense: Expense) => {
    // Adicionar ID único
    const newExpense = {
      ...expense,
      id: Date.now()
    };
    
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    
    // Salvar no localStorage
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    
    alert(`Despesa adicionada: ${expense.description} - R$ ${expense.amount}`);
  };

  // Função para excluir despesa
  const handleDeleteExpense = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(updatedExpenses);
      
      // Salvar no localStorage
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    }
  };

  // Calcular totais para KPIs
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = filteredExpenses.length > 0 
    ? totalExpenses / filteredExpenses.length 
    : 0;
  const highestExpense = filteredExpenses.length > 0 
    ? Math.max(...filteredExpenses.map(expense => expense.amount)) 
    : 0;

  return (
    <div className="expenses-screen">
      <div className="expenses-header">
        <h2>Gerenciamento de Despesas</h2>
        <div className="filters">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Categorias</option>
            {categoryData.labels.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todo o Período</option>
            <option value="month">Este Mês</option>
            <option value="year">Este Ano</option>
          </select>
          
          <input 
            type="text" 
            placeholder="Buscar despesas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="kpi-container">
        <KPICard 
          title="Total de Despesas" 
          value={`R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change={filteredExpenses.length.toString()} 
          icon="money"
        />
        <KPICard 
          title="Média por Despesa" 
          value={`R$ ${averageExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change="" 
          icon="calculator"
        />
        <KPICard 
          title="Maior Despesa" 
          value={`R$ ${highestExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change="" 
          icon="warning"
        />
      </div>
      
      <div className="expenses-content">
        <div className="expenses-form-container">
          <h3>Adicionar Nova Despesa</h3>
          <ExpenseForm onAddExpense={handleAddExpense} />
        </div>
        
        <div className="charts-container">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Despesas por Categoria</h3>
            </div>
            <div className="chart-body">
              <PieChart data={categoryData} />
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-header">
              <h3>Despesas Mensais</h3>
            </div>
            <div className="chart-body">
              <BarChart data={monthlyData} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="expenses-table-container">
        <h3>Lista de Despesas</h3>
        <div className="expenses-list">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Método de Pagamento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{new Date(expense.date).toLocaleDateString('pt-BR')}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td className="expense-amount">R$ {expense.amount.toFixed(2)}</td>
                    <td>{expense.paymentMethod || 'Não especificado'}</td>
                    <td>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteExpense(expense.id || 0)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-data">Nenhuma despesa encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesScreen; 