import React, { useState, useEffect } from 'react';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import KPICard from './KPICard';
import '../styles/IncomeScreen.css';

interface Income {
  id?: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  isRecurring?: boolean;
  frequency?: string;
}

const IncomeScreen: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('month');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newIncome, setNewIncome] = useState<Income>({
    description: '',
    amount: 0,
    category: 'Salário',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    frequency: 'monthly'
  });
  
  // Categorias de receita
  const incomeCategories = [
    'Salário', 
    'Freelance', 
    'Investimentos', 
    'Aluguel', 
    'Vendas', 
    'Bônus', 
    'Outros'
  ];
  
  // Dados para os gráficos
  const [monthlyData, setMonthlyData] = useState({
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Receitas Mensais',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });
  
  const [categoryData, setCategoryData] = useState({
    labels: incomeCategories,
    datasets: [
      {
        label: 'Receitas por Categoria',
        data: Array(incomeCategories.length).fill(0),
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(199, 199, 199, 0.7)',
        ],
      },
    ],
  });

  // Carregar receitas do localStorage
  useEffect(() => {
    const savedIncomes = localStorage.getItem('incomes');
    if (savedIncomes) {
      const parsedIncomes = JSON.parse(savedIncomes);
      setIncomes(parsedIncomes);
      setFilteredIncomes(parsedIncomes);
      updateCharts(parsedIncomes);
    }
  }, []);

  // Atualizar filtros quando as receitas mudarem
  useEffect(() => {
    applyFilters();
  }, [incomes, categoryFilter, dateFilter, searchTerm]);

  // Função para atualizar os gráficos
  const updateCharts = (incomeData: Income[]) => {
    // Atualizar gráfico mensal
    const monthlyIncomes: number[] = Array(12).fill(0);
    
    incomeData.forEach(income => {
      const incomeMonth = new Date(income.date).getMonth();
      monthlyIncomes[incomeMonth] += income.amount;
    });

    const updatedMonthlyData = { ...monthlyData };
    updatedMonthlyData.datasets[0].data = monthlyIncomes;
    setMonthlyData(updatedMonthlyData);
    
    // Atualizar gráfico de categorias
    const categoryCounts: { [key: string]: number } = {};
    incomeCategories.forEach(category => {
      categoryCounts[category] = 0;
    });

    incomeData.forEach(income => {
      if (categoryCounts[income.category] !== undefined) {
        categoryCounts[income.category] += income.amount;
      } else {
        categoryCounts['Outros'] += income.amount;
      }
    });

    const updatedCategoryData = { ...categoryData };
    updatedCategoryData.datasets[0].data = incomeCategories.map(
      category => categoryCounts[category] || 0
    );
    setCategoryData(updatedCategoryData);
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    let filtered = [...incomes];
    
    // Filtrar por categoria
    if (categoryFilter) {
      filtered = filtered.filter(income => income.category === categoryFilter);
    }
    
    // Filtrar por data
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    if (dateFilter === 'month') {
      filtered = filtered.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === currentMonth && 
               incomeDate.getFullYear() === currentYear;
      });
    } else if (dateFilter === 'year') {
      filtered = filtered.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear() === currentYear;
      });
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(income => 
        income.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredIncomes(filtered);
    updateCharts(filtered);
  };

  // Função para adicionar nova receita
  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIncome.description || newIncome.amount <= 0) {
      alert('Por favor, preencha a descrição e um valor válido.');
      return;
    }
    
    // Adicionar ID único
    const incomeToAdd = {
      ...newIncome,
      id: Date.now()
    };
    
    const updatedIncomes = [...incomes, incomeToAdd];
    setIncomes(updatedIncomes);
    
    // Salvar no localStorage
    localStorage.setItem('incomes', JSON.stringify(updatedIncomes));
    
    // Limpar formulário
    setNewIncome({
      description: '',
      amount: 0,
      category: 'Salário',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      frequency: 'monthly'
    });
    
    alert(`Receita adicionada: ${incomeToAdd.description} - R$ ${incomeToAdd.amount}`);
  };

  // Função para excluir receita
  const handleDeleteIncome = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      const updatedIncomes = incomes.filter(income => income.id !== id);
      setIncomes(updatedIncomes);
      
      // Salvar no localStorage
      localStorage.setItem('incomes', JSON.stringify(updatedIncomes));
    }
  };

  // Função para atualizar campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewIncome(prev => ({ ...prev, [name]: checked }));
    } else {
      setNewIncome(prev => ({ ...prev, [name]: value }));
    }
  };

  // Calcular totais para KPIs
  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const averageIncome = filteredIncomes.length > 0 
    ? totalIncome / filteredIncomes.length 
    : 0;
  const recurringIncome = filteredIncomes
    .filter(income => income.isRecurring)
    .reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="income-screen">
      <div className="income-header">
        <h2>Gerenciamento de Receitas</h2>
        <div className="filters">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Categorias</option>
            {incomeCategories.map((category, index) => (
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
            placeholder="Buscar receitas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="kpi-container">
        <KPICard 
          title="Total de Receitas" 
          value={`R$ ${totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change={filteredIncomes.length.toString()} 
          icon="income"
        />
        <KPICard 
          title="Média por Receita" 
          value={`R$ ${averageIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change="" 
          icon="calculator"
        />
        <KPICard 
          title="Receitas Recorrentes" 
          value={`R$ ${recurringIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change="" 
          icon="refresh"
        />
      </div>
      
      <div className="income-content">
        <div className="income-form-container">
          <h3>Adicionar Nova Receita</h3>
          <form onSubmit={handleAddIncome} className="income-form">
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newIncome.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Valor (R$)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                min="0.01"
                step="0.01"
                value={newIncome.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                name="category"
                value={newIncome.category}
                onChange={handleInputChange}
              >
                {incomeCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Data</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newIncome.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={newIncome.isRecurring}
                onChange={handleInputChange}
              />
              <label htmlFor="isRecurring">Receita Recorrente</label>
            </div>
            
            {newIncome.isRecurring && (
              <div className="form-group">
                <label htmlFor="frequency">Frequência</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={newIncome.frequency}
                  onChange={handleInputChange}
                >
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quinzenal</option>
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>
            )}
            
            <button type="submit" className="btn-submit">Adicionar Receita</button>
          </form>
        </div>
        
        <div className="charts-container">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Receitas Mensais</h3>
            </div>
            <div className="chart-body">
              <LineChart data={monthlyData} />
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-header">
              <h3>Receitas por Categoria</h3>
            </div>
            <div className="chart-body">
              <BarChart data={categoryData} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="income-table-container">
        <h3>Lista de Receitas</h3>
        <div className="income-list">
          <table className="income-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Recorrente</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.length > 0 ? (
                filteredIncomes.map((income) => (
                  <tr key={income.id}>
                    <td>{new Date(income.date).toLocaleDateString('pt-BR')}</td>
                    <td>{income.description}</td>
                    <td>{income.category}</td>
                    <td className="income-amount">R$ {income.amount.toFixed(2)}</td>
                    <td>{income.isRecurring ? `Sim (${income.frequency})` : 'Não'}</td>
                    <td>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteIncome(income.id || 0)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-data">Nenhuma receita encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomeScreen; 