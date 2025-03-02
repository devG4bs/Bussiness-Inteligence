import React, { useState, useEffect, useMemo } from 'react';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import KPICard from './KPICard';
import ExpenseForm from './ExpenseForm';
import WhatsAppIntegration from './WhatsAppIntegration';
import { salesData as initialSalesData, marketingData as initialMarketingData, financialData as initialFinancialData, creditCardData as initialCreditCardData } from '../data/mockData';
import { parseWhatsAppMessage } from '../data/whatsappExample';
import '../styles/Dashboard.css';

interface Expense {
  description: string;
  amount: number;
  category: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [connectedPhone, setConnectedPhone] = useState('');
  const [filter, setFilter] = useState('month');
  
  // Estados para os dados dos gráficos
  const [salesData, setSalesData] = useState(initialSalesData);
  const [marketingData, setMarketingData] = useState(initialMarketingData);
  const [financialData, setFinancialData] = useState(initialFinancialData);
  const [creditCardData, setCreditCardData] = useState(initialCreditCardData);
  
  // Calcular saldo atual (último mês)
  const lastMonthIndex = salesData.labels.length - 1;
  const lastMonthIncome = salesData.datasets[1].data[lastMonthIndex];
  const lastMonthExpenses = salesData.datasets[0].data[lastMonthIndex];
  const currentBalance = lastMonthIncome - lastMonthExpenses;
  
  // Calcular economia total (diferença entre receita e gastos ao longo do ano)
  const totalIncome = salesData.datasets[1].data.reduce((sum, value) => sum + value, 0);
  const totalExpenses = salesData.datasets[0].data.reduce((sum, value) => sum + value, 0);
  const totalSavings = totalIncome - totalExpenses;
  
  // Última fatura do cartão
  const lastCreditCardBill = creditCardData.datasets[0].data[lastMonthIndex];

  // Carregar despesas do localStorage ao iniciar
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setExpenses(parsedExpenses);
      updateChartsWithExpenses(parsedExpenses);
    }
  }, []);

  // Salvar despesas no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Função para atualizar os gráficos com base nas despesas
  const updateChartsWithExpenses = (currentExpenses: Expense[]) => {
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
  };

  const handleAddExpense = (expense: Expense) => {
    const newExpenses = [...expenses, expense];
    setExpenses(newExpenses);
    
    // Atualizar os gráficos com as novas despesas
    updateChartsWithExpenses(newExpenses);
    
    alert(`Despesa adicionada: ${expense.description} - R$ ${expense.amount}\n\nOs gráficos foram atualizados com os novos dados.`);
  };

  const handleWhatsAppConnect = (phoneNumber: string) => {
    setWhatsappConnected(true);
    setConnectedPhone(phoneNumber);
    console.log(`WhatsApp conectado com o número: ${phoneNumber}`);
    
    // Aqui você implementaria a lógica real de conexão com WhatsApp
    // Isso normalmente envolveria uma API de backend
  };

  const handleWhatsAppMessage = (message: string) => {
    const parsedExpense = parseWhatsAppMessage(message);
    
    if (parsedExpense) {
      const newExpenses = [...expenses, parsedExpense];
      setExpenses(newExpenses);
      
      // Atualizar os gráficos com as novas despesas
      updateChartsWithExpenses(newExpenses);
      
      alert(`Despesa adicionada via WhatsApp: ${parsedExpense.description} - R$ ${parsedExpense.amount}\n\nOs gráficos foram atualizados com os novos dados.`);
      return true;
    }
    
    return false;
  };
  
  // Dados para os KPI cards
  const kpiData = {
    saldoAtual: {
      title: 'Saldo Atual',
      value: `R$ ${currentBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
      change: '+12%',
      icon: 'wallet'
    },
    ultimaReceita: {
      title: 'Última Receita',
      value: `R$ ${lastMonthIncome.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
      change: '+8%',
      icon: 'income'
    },
    ultimaFatura: {
      title: 'Última Fatura',
      value: `R$ ${lastCreditCardBill.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
      change: '-5%',
      icon: 'card'
    },
    economiaTotal: {
      title: 'Economia Total',
      value: `R$ ${totalSavings.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
      change: '+15%',
      icon: 'savings'
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Controle Financeiro Pessoal</h1>
        <div className="filter-container">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
            <option value="all">Todo Período</option>
          </select>
        </div>
      </div>
      
      <div className="kpi-container">
        <KPICard 
          title={kpiData.saldoAtual.title}
          value={kpiData.saldoAtual.value}
          change={kpiData.saldoAtual.change}
          icon={kpiData.saldoAtual.icon}
        />
        <KPICard 
          title={kpiData.ultimaReceita.title}
          value={kpiData.ultimaReceita.value}
          change={kpiData.ultimaReceita.change}
          icon={kpiData.ultimaReceita.icon}
        />
        <KPICard 
          title={kpiData.ultimaFatura.title}
          value={kpiData.ultimaFatura.value}
          change={kpiData.ultimaFatura.change}
          icon={kpiData.ultimaFatura.icon}
        />
        <KPICard 
          title={kpiData.economiaTotal.title}
          value={kpiData.economiaTotal.value}
          change={kpiData.economiaTotal.change}
          icon={kpiData.economiaTotal.icon}
        />
      </div>
      
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h2>Receitas vs. Despesas</h2>
            <button className="chart-options-btn">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
          <div className="chart-content">
            <LineChart data={salesData} />
          </div>
        </div>
        
        <div className="chart-container">
          <div className="chart-header">
            <h2>Gastos por Categoria</h2>
            <button className="chart-options-btn">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
          <div className="chart-content">
            <BarChart data={marketingData} />
          </div>
        </div>
        
        <div className="chart-container">
          <div className="chart-header">
            <h2>Distribuição de Gastos</h2>
            <button className="chart-options-btn">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
          <div className="chart-content">
            <PieChart data={financialData} />
          </div>
        </div>
        
        <div className="chart-container">
          <div className="chart-header">
            <h2>Histórico de Faturas do Cartão</h2>
            <button className="chart-options-btn">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
          <div className="chart-content">
            <LineChart data={creditCardData} />
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <button className="btn btn-primary" onClick={() => document.getElementById('expense-form')?.classList.toggle('show')}>
          <i className="fas fa-plus"></i> Adicionar Despesa
        </button>
      </div>
      
      <div id="expense-form" className="expense-form-container">
        <ExpenseForm onAddExpense={handleAddExpense} />
      </div>
      
      <div className="whatsapp-integration-card">
        <h2>Integração com WhatsApp</h2>
        <p>Conecte seu WhatsApp para enviar e receber atualizações sobre suas finanças.</p>
        <div className="whatsapp-input-container">
          <input 
            type="text" 
            placeholder="Seu número de telefone com DDD" 
            className="whatsapp-input"
            id="whatsapp-phone"
          />
          <button 
            className="btn btn-primary"
            onClick={() => {
              const phone = (document.getElementById('whatsapp-phone') as HTMLInputElement).value;
              if (phone) handleWhatsAppConnect(phone);
            }}
          >
            Conectar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 