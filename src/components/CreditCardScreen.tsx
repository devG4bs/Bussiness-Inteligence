import React, { useState, useEffect } from 'react';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import KPICard from './KPICard';
import '../styles/CreditCardScreen.css';

interface CreditCard {
  id?: number;
  name: string;
  lastDigits: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color: string;
}

interface CardExpense {
  id?: number;
  cardId: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  installments?: number;
  currentInstallment?: number;
}

const CreditCardScreen: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [cardExpenses, setCardExpenses] = useState<CardExpense[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [newCard, setNewCard] = useState<CreditCard>({
    name: '',
    lastDigits: '',
    limit: 0,
    closingDay: 1,
    dueDay: 10,
    color: '#00E396'
  });
  const [newExpense, setNewExpense] = useState<CardExpense>({
    cardId: 0,
    description: '',
    amount: 0,
    category: 'Outros',
    date: new Date().toISOString().split('T')[0],
    installments: 1,
    currentInstallment: 1
  });
  
  // Categorias de despesas
  const expenseCategories = [
    'Alimentação', 
    'Transporte', 
    'Lazer', 
    'Saúde', 
    'Educação', 
    'Compras', 
    'Serviços', 
    'Outros'
  ];
  
  // Dados para os gráficos
  const [monthlyData, setMonthlyData] = useState({
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Faturas Mensais',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  });
  
  const [categoryData, setCategoryData] = useState({
    labels: expenseCategories,
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: Array(expenseCategories.length).fill(0),
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

  // Carregar cartões e despesas do localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem('creditCards');
    const savedExpenses = localStorage.getItem('cardExpenses');
    
    if (savedCards) {
      const parsedCards = JSON.parse(savedCards);
      setCards(parsedCards);
      
      if (parsedCards.length > 0 && !selectedCard) {
        setSelectedCard(parsedCards[0].id);
        setNewExpense(prev => ({ ...prev, cardId: parsedCards[0].id || 0 }));
      }
    }
    
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setCardExpenses(parsedExpenses);
      updateCharts(parsedExpenses, selectedCard);
    }
  }, []);

  // Atualizar gráficos quando o cartão selecionado mudar
  useEffect(() => {
    updateCharts(cardExpenses, selectedCard);
  }, [selectedCard, cardExpenses]);

  // Função para atualizar os gráficos
  const updateCharts = (expenses: CardExpense[], cardId: number | null) => {
    // Filtrar despesas pelo cartão selecionado
    const filteredExpenses = cardId 
      ? expenses.filter(expense => expense.cardId === cardId)
      : expenses;
    
    // Atualizar gráfico mensal
    const monthlyExpenses: number[] = Array(12).fill(0);
    
    filteredExpenses.forEach(expense => {
      const expenseMonth = new Date(expense.date).getMonth();
      monthlyExpenses[expenseMonth] += expense.amount;
    });

    const updatedMonthlyData = { ...monthlyData };
    updatedMonthlyData.datasets[0].data = monthlyExpenses;
    setMonthlyData(updatedMonthlyData);
    
    // Atualizar gráfico de categorias
    const categoryCounts: { [key: string]: number } = {};
    expenseCategories.forEach(category => {
      categoryCounts[category] = 0;
    });

    filteredExpenses.forEach(expense => {
      if (categoryCounts[expense.category] !== undefined) {
        categoryCounts[expense.category] += expense.amount;
      } else {
        categoryCounts['Outros'] += expense.amount;
      }
    });

    const updatedCategoryData = { ...categoryData };
    updatedCategoryData.datasets[0].data = expenseCategories.map(
      category => categoryCounts[category] || 0
    );
    setCategoryData(updatedCategoryData);
  };

  // Função para adicionar novo cartão
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCard.name || !newCard.lastDigits || newCard.limit <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Validar últimos dígitos
    if (newCard.lastDigits.length !== 4 || !/^\d+$/.test(newCard.lastDigits)) {
      alert('Os últimos dígitos devem conter exatamente 4 números.');
      return;
    }
    
    // Adicionar ID único
    const cardToAdd = {
      ...newCard,
      id: Date.now()
    };
    
    const updatedCards = [...cards, cardToAdd];
    setCards(updatedCards);
    
    // Selecionar o novo cartão
    setSelectedCard(cardToAdd.id);
    setNewExpense(prev => ({ ...prev, cardId: cardToAdd.id || 0 }));
    
    // Salvar no localStorage
    localStorage.setItem('creditCards', JSON.stringify(updatedCards));
    
    // Limpar formulário
    setNewCard({
      name: '',
      lastDigits: '',
      limit: 0,
      closingDay: 1,
      dueDay: 10,
      color: '#00E396'
    });
    
    alert(`Cartão adicionado: ${cardToAdd.name}`);
  };

  // Função para adicionar nova despesa no cartão
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExpense.description || newExpense.amount <= 0 || !newExpense.cardId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Adicionar ID único
    const expenseToAdd = {
      ...newExpense,
      id: Date.now()
    };
    
    const updatedExpenses = [...cardExpenses, expenseToAdd];
    setCardExpenses(updatedExpenses);
    
    // Salvar no localStorage
    localStorage.setItem('cardExpenses', JSON.stringify(updatedExpenses));
    
    // Limpar formulário (mantendo o cartão selecionado)
    setNewExpense({
      cardId: newExpense.cardId,
      description: '',
      amount: 0,
      category: 'Outros',
      date: new Date().toISOString().split('T')[0],
      installments: 1,
      currentInstallment: 1
    });
    
    alert(`Despesa adicionada: ${expenseToAdd.description} - R$ ${expenseToAdd.amount}`);
  };

  // Função para excluir cartão
  const handleDeleteCard = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cartão? Todas as despesas associadas também serão excluídas.')) {
      const updatedCards = cards.filter(card => card.id !== id);
      const updatedExpenses = cardExpenses.filter(expense => expense.cardId !== id);
      
      setCards(updatedCards);
      setCardExpenses(updatedExpenses);
      
      // Atualizar cartão selecionado
      if (selectedCard === id) {
        setSelectedCard(updatedCards.length > 0 ? updatedCards[0].id : null);
      }
      
      // Salvar no localStorage
      localStorage.setItem('creditCards', JSON.stringify(updatedCards));
      localStorage.setItem('cardExpenses', JSON.stringify(updatedExpenses));
    }
  };

  // Função para excluir despesa
  const handleDeleteExpense = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      const updatedExpenses = cardExpenses.filter(expense => expense.id !== id);
      setCardExpenses(updatedExpenses);
      
      // Salvar no localStorage
      localStorage.setItem('cardExpenses', JSON.stringify(updatedExpenses));
    }
  };

  // Função para atualizar campos do formulário de cartão
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  // Função para atualizar campos do formulário de despesa
  const handleExpenseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'installments' && parseInt(value) > 1) {
      setNewExpense(prev => ({ 
        ...prev, 
        [name]: parseInt(value),
        currentInstallment: 1
      }));
    } else {
      setNewExpense(prev => ({ ...prev, [name]: value }));
    }
  };

  // Calcular totais para KPIs
  const selectedCardData = cards.find(card => card.id === selectedCard);
  const filteredExpenses = selectedCard 
    ? cardExpenses.filter(expense => expense.cardId === selectedCard)
    : [];
  
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = filteredExpenses
    .filter(expense => new Date(expense.date).getMonth() === currentMonth)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const availableLimit = selectedCardData 
    ? selectedCardData.limit - currentMonthExpenses 
    : 0;
  
  const utilizationRate = selectedCardData 
    ? (currentMonthExpenses / selectedCardData.limit) * 100 
    : 0;

  return (
    <div className="credit-card-screen">
      <div className="credit-card-header">
        <h2>Gerenciamento de Cartões de Crédito</h2>
        <div className="card-selector">
          <select 
            value={selectedCard || ''} 
            onChange={(e) => setSelectedCard(parseInt(e.target.value) || null)}
            className="card-select"
          >
            <option value="">Selecione um cartão</option>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name} (**** {card.lastDigits})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {selectedCardData ? (
        <>
          <div className="card-display" style={{ backgroundColor: selectedCardData.color }}>
            <div className="card-header">
              <h3>{selectedCardData.name}</h3>
              <div className="card-actions">
                <button 
                  className="btn-delete-card" 
                  onClick={() => handleDeleteCard(selectedCardData.id || 0)}
                >
                  Excluir Cartão
                </button>
              </div>
            </div>
            <div className="card-number">**** **** **** {selectedCardData.lastDigits}</div>
            <div className="card-details">
              <div className="card-detail">
                <span>Limite:</span>
                <span>R$ {selectedCardData.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="card-detail">
                <span>Fechamento:</span>
                <span>Dia {selectedCardData.closingDay}</span>
              </div>
              <div className="card-detail">
                <span>Vencimento:</span>
                <span>Dia {selectedCardData.dueDay}</span>
              </div>
            </div>
          </div>
          
          <div className="kpi-container">
            <KPICard 
              title="Fatura Atual" 
              value={`R$ ${currentMonthExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
              change={`${filteredExpenses.length} compras`} 
              icon="card"
            />
            <KPICard 
              title="Limite Disponível" 
              value={`R$ ${availableLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
              change="" 
              icon="money"
            />
            <KPICard 
              title="Utilização" 
              value={`${utilizationRate.toFixed(1)}%`} 
              change={utilizationRate > 80 ? "Alto" : utilizationRate > 50 ? "Médio" : "Baixo"} 
              icon="chart"
            />
          </div>
          
          <div className="credit-card-content">
            <div className="expense-form-container">
              <h3>Adicionar Nova Compra</h3>
              <form onSubmit={handleAddExpense} className="expense-form">
                <div className="form-group">
                  <label htmlFor="description">Descrição</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={newExpense.description}
                    onChange={handleExpenseInputChange}
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
                    value={newExpense.amount}
                    onChange={handleExpenseInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Categoria</label>
                  <select
                    id="category"
                    name="category"
                    value={newExpense.category}
                    onChange={handleExpenseInputChange}
                  >
                    {expenseCategories.map((category, index) => (
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
                    value={newExpense.date}
                    onChange={handleExpenseInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="installments">Parcelas</label>
                  <input
                    type="number"
                    id="installments"
                    name="installments"
                    min="1"
                    max="24"
                    value={newExpense.installments}
                    onChange={handleExpenseInputChange}
                  />
                </div>
                
                {(newExpense.installments || 0) > 1 && (
                  <div className="form-group">
                    <label htmlFor="currentInstallment">Parcela Atual</label>
                    <input
                      type="number"
                      id="currentInstallment"
                      name="currentInstallment"
                      min="1"
                      max={newExpense.installments}
                      value={newExpense.currentInstallment}
                      onChange={handleExpenseInputChange}
                    />
                  </div>
                )}
                
                <button type="submit" className="btn-submit">Adicionar Compra</button>
              </form>
            </div>
            
            <div className="charts-container">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Faturas Mensais</h3>
                </div>
                <div className="chart-body">
                  <LineChart data={monthlyData} />
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Gastos por Categoria</h3>
                </div>
                <div className="chart-body">
                  <PieChart data={categoryData} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="expenses-table-container">
            <h3>Compras Recentes</h3>
            <div className="expenses-list">
              <table className="expenses-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Parcelas</th>
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
                        <td>
                          {(expense.installments || 0) > 1 
                            ? `${expense.currentInstallment}/${expense.installments}` 
                            : 'À vista'}
                        </td>
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
                      <td colSpan={6} className="no-data">Nenhuma compra encontrada</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="add-card-container">
          <h3>Adicionar Novo Cartão</h3>
          <form onSubmit={handleAddCard} className="card-form">
            <div className="form-group">
              <label htmlFor="name">Nome do Cartão</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCard.name}
                onChange={handleCardInputChange}
                placeholder="Ex: Nubank, Itaú Platinum"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastDigits">Últimos 4 dígitos</label>
              <input
                type="text"
                id="lastDigits"
                name="lastDigits"
                value={newCard.lastDigits}
                onChange={handleCardInputChange}
                maxLength={4}
                placeholder="1234"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="limit">Limite (R$)</label>
              <input
                type="number"
                id="limit"
                name="limit"
                min="1"
                step="0.01"
                value={newCard.limit}
                onChange={handleCardInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="closingDay">Dia de Fechamento</label>
                <input
                  type="number"
                  id="closingDay"
                  name="closingDay"
                  min="1"
                  max="31"
                  value={newCard.closingDay}
                  onChange={handleCardInputChange}
                  required
                />
              </div>
              
              <div className="form-group half">
                <label htmlFor="dueDay">Dia de Vencimento</label>
                <input
                  type="number"
                  id="dueDay"
                  name="dueDay"
                  min="1"
                  max="31"
                  value={newCard.dueDay}
                  onChange={handleCardInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="color">Cor do Cartão</label>
              <input
                type="color"
                id="color"
                name="color"
                value={newCard.color}
                onChange={handleCardInputChange}
              />
            </div>
            
            <button type="submit" className="btn-submit">Adicionar Cartão</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreditCardScreen; 