import React, { useState, useEffect } from 'react';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import KPICard from './KPICard';
import '../styles/InvestmentsScreen.css';

interface Investment {
  id?: number;
  name: string;
  type: string;
  amount: number;
  initialDate: string;
  dueDate?: string;
  expectedReturn: number;
  risk: string;
  institution: string;
  notes?: string;
}

interface InvestmentPerformance {
  date: string;
  value: number;
}

const InvestmentsScreen: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInvestment, setSelectedInvestment] = useState<number | null>(null);
  const [newInvestment, setNewInvestment] = useState<Investment>({
    name: '',
    type: 'Renda Fixa',
    amount: 0,
    initialDate: new Date().toISOString().split('T')[0],
    expectedReturn: 0,
    risk: 'Baixo',
    institution: ''
  });
  
  // Tipos de investimento
  const investmentTypes = [
    'Renda Fixa', 
    'Renda Variável', 
    'Fundos', 
    'Tesouro Direto', 
    'Poupança', 
    'CDB', 
    'LCI/LCA', 
    'Ações', 
    'FIIs', 
    'Criptomoedas', 
    'Outros'
  ];
  
  // Níveis de risco
  const riskLevels = ['Baixo', 'Médio', 'Alto'];
  
  // Dados para os gráficos
  const [typeData, setTypeData] = useState({
    labels: ['Renda Fixa', 'Renda Variável', 'Fundos', 'Outros'],
    datasets: [
      {
        label: 'Distribuição por Tipo',
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
      },
    ],
  });
  
  const [performanceData, setPerformanceData] = useState({
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Valor Total',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });
  
  // Dados de desempenho simulados para cada investimento
  const [investmentPerformances, setInvestmentPerformances] = useState<{[key: number]: InvestmentPerformance[]}>({});

  // Carregar investimentos do localStorage
  useEffect(() => {
    const savedInvestments = localStorage.getItem('investments');
    const savedPerformances = localStorage.getItem('investmentPerformances');
    
    if (savedInvestments) {
      const parsedInvestments = JSON.parse(savedInvestments);
      setInvestments(parsedInvestments);
      setFilteredInvestments(parsedInvestments);
      
      if (parsedInvestments.length > 0 && !selectedInvestment) {
        setSelectedInvestment(parsedInvestments[0].id);
      }
    }
    
    if (savedPerformances) {
      setInvestmentPerformances(JSON.parse(savedPerformances));
    }
    
    updateCharts(investments);
  }, []);

  // Atualizar filtros quando os investimentos mudarem
  useEffect(() => {
    applyFilters();
  }, [investments, typeFilter, riskFilter, searchTerm]);

  // Gerar dados de desempenho simulados para um novo investimento
  const generatePerformanceData = (investment: Investment): InvestmentPerformance[] => {
    const performances: InvestmentPerformance[] = [];
    const startDate = new Date(investment.initialDate);
    const today = new Date();
    const monthDiff = today.getMonth() - startDate.getMonth() + 
                     (12 * (today.getFullYear() - startDate.getFullYear()));
    
    let currentValue = investment.amount;
    
    // Gerar pelo menos 12 meses de dados (ou menos se o investimento for mais recente)
    const monthsToGenerate = Math.min(12, Math.max(1, monthDiff + 1));
    
    for (let i = 0; i < monthsToGenerate; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      
      // Simular variação de desempenho com base no risco
      let variation = 0;
      switch (investment.risk) {
        case 'Baixo':
          variation = (Math.random() * 0.01) + 0.003; // 0.3% a 1.3% ao mês
          break;
        case 'Médio':
          variation = (Math.random() * 0.03) - 0.005; // -0.5% a 2.5% ao mês
          break;
        case 'Alto':
          variation = (Math.random() * 0.08) - 0.02; // -2% a 6% ao mês
          break;
        default:
          variation = (Math.random() * 0.01); // 0% a 1% ao mês
      }
      
      // Aplicar variação
      currentValue = currentValue * (1 + variation);
      
      performances.push({
        date: date.toISOString().split('T')[0],
        value: currentValue
      });
    }
    
    return performances;
  };

  // Função para atualizar os gráficos
  const updateCharts = (investmentData: Investment[]) => {
    // Atualizar gráfico de tipos
    const typeCounts: { [key: string]: number } = {
      'Renda Fixa': 0,
      'Renda Variável': 0,
      'Fundos': 0,
      'Outros': 0
    };
    
    investmentData.forEach(investment => {
      if (investment.type === 'Renda Fixa' || investment.type === 'Tesouro Direto' || 
          investment.type === 'CDB' || investment.type === 'LCI/LCA' || investment.type === 'Poupança') {
        typeCounts['Renda Fixa'] += investment.amount;
      } else if (investment.type === 'Renda Variável' || investment.type === 'Ações' || 
                investment.type === 'FIIs' || investment.type === 'Criptomoedas') {
        typeCounts['Renda Variável'] += investment.amount;
      } else if (investment.type === 'Fundos') {
        typeCounts['Fundos'] += investment.amount;
      } else {
        typeCounts['Outros'] += investment.amount;
      }
    });

    const updatedTypeData = { ...typeData };
    updatedTypeData.datasets[0].data = [
      typeCounts['Renda Fixa'],
      typeCounts['Renda Variável'],
      typeCounts['Fundos'],
      typeCounts['Outros']
    ];
    setTypeData(updatedTypeData);
    
    // Atualizar gráfico de desempenho
    const monthlyTotals: number[] = Array(12).fill(0);
    
    // Usar os dados de desempenho para calcular o valor total por mês
    Object.values(investmentPerformances).forEach(performances => {
      performances.forEach(performance => {
        const performanceDate = new Date(performance.date);
        const month = performanceDate.getMonth();
        monthlyTotals[month] += performance.value;
      });
    });
    
    const updatedPerformanceData = { ...performanceData };
    updatedPerformanceData.datasets[0].data = monthlyTotals;
    setPerformanceData(updatedPerformanceData);
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    let filtered = [...investments];
    
    // Filtrar por tipo
    if (typeFilter) {
      filtered = filtered.filter(investment => investment.type === typeFilter);
    }
    
    // Filtrar por risco
    if (riskFilter) {
      filtered = filtered.filter(investment => investment.risk === riskFilter);
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(investment => 
        investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.institution.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredInvestments(filtered);
    updateCharts(filtered);
  };

  // Função para adicionar novo investimento
  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInvestment.name || newInvestment.amount <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Adicionar ID único
    const investmentToAdd = {
      ...newInvestment,
      id: Date.now()
    };
    
    const updatedInvestments = [...investments, investmentToAdd];
    setInvestments(updatedInvestments);
    
    // Gerar dados de desempenho simulados
    const performances = generatePerformanceData(investmentToAdd);
    const updatedPerformances = {
      ...investmentPerformances,
      [investmentToAdd.id as number]: performances
    };
    setInvestmentPerformances(updatedPerformances);
    
    // Selecionar o novo investimento
    setSelectedInvestment(investmentToAdd.id);
    
    // Salvar no localStorage
    localStorage.setItem('investments', JSON.stringify(updatedInvestments));
    localStorage.setItem('investmentPerformances', JSON.stringify(updatedPerformances));
    
    // Limpar formulário
    setNewInvestment({
      name: '',
      type: 'Renda Fixa',
      amount: 0,
      initialDate: new Date().toISOString().split('T')[0],
      expectedReturn: 0,
      risk: 'Baixo',
      institution: ''
    });
    
    alert(`Investimento adicionado: ${investmentToAdd.name}`);
  };

  // Função para excluir investimento
  const handleDeleteInvestment = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este investimento?')) {
      const updatedInvestments = investments.filter(investment => investment.id !== id);
      setInvestments(updatedInvestments);
      
      // Remover dados de desempenho
      const updatedPerformances = { ...investmentPerformances };
      delete updatedPerformances[id];
      setInvestmentPerformances(updatedPerformances);
      
      // Atualizar investimento selecionado
      if (selectedInvestment === id) {
        setSelectedInvestment(updatedInvestments.length > 0 ? updatedInvestments[0].id : null);
      }
      
      // Salvar no localStorage
      localStorage.setItem('investments', JSON.stringify(updatedInvestments));
      localStorage.setItem('investmentPerformances', JSON.stringify(updatedPerformances));
    }
  };

  // Função para atualizar campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewInvestment(prev => ({ ...prev, [name]: value }));
  };

  // Calcular totais para KPIs
  const totalInvested = filteredInvestments.reduce((sum, investment) => sum + investment.amount, 0);
  
  // Calcular valor atual total (baseado nos dados de desempenho)
  const currentTotal = Object.values(investmentPerformances).reduce((sum, performances) => {
    if (performances.length > 0) {
      return sum + performances[performances.length - 1].value;
    }
    return sum;
  }, 0);
  
  // Calcular retorno total
  const totalReturn = currentTotal - totalInvested;
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  // Obter dados do investimento selecionado
  const selectedInvestmentData = investments.find(inv => inv.id === selectedInvestment);
  const selectedPerformance = selectedInvestment ? investmentPerformances[selectedInvestment] || [] : [];
  
  // Calcular retorno do investimento selecionado
  const initialValue = selectedInvestmentData ? selectedInvestmentData.amount : 0;
  const currentValue = selectedPerformance.length > 0 ? selectedPerformance[selectedPerformance.length - 1].value : initialValue;
  const selectedReturn = currentValue - initialValue;
  const selectedReturnPercentage = initialValue > 0 ? (selectedReturn / initialValue) * 100 : 0;

  return (
    <div className="investments-screen">
      <div className="investments-header">
        <h2>Gerenciamento de Investimentos</h2>
        <div className="filters">
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Tipos</option>
            {investmentTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
          
          <select 
            value={riskFilter} 
            onChange={(e) => setRiskFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Riscos</option>
            {riskLevels.map((risk, index) => (
              <option key={index} value={risk}>{risk}</option>
            ))}
          </select>
          
          <input 
            type="text" 
            placeholder="Buscar investimentos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="kpi-container">
        <KPICard 
          title="Total Investido" 
          value={`R$ ${totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change={`${filteredInvestments.length} ativos`} 
          icon="money"
        />
        <KPICard 
          title="Valor Atual" 
          value={`R$ ${currentTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change="" 
          icon="chart"
        />
        <KPICard 
          title="Retorno Total" 
          value={`R$ ${totalReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change={`${returnPercentage.toFixed(2)}%`} 
          icon={returnPercentage >= 0 ? "up" : "down"}
        />
      </div>
      
      <div className="investments-content">
        <div className="investment-form-container">
          <h3>Adicionar Novo Investimento</h3>
          <form onSubmit={handleAddInvestment} className="investment-form">
            <div className="form-group">
              <label htmlFor="name">Nome do Investimento</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newInvestment.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="type">Tipo</label>
              <select
                id="type"
                name="type"
                value={newInvestment.type}
                onChange={handleInputChange}
              >
                {investmentTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Valor Investido (R$)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                min="0.01"
                step="0.01"
                value={newInvestment.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="initialDate">Data Inicial</label>
              <input
                type="date"
                id="initialDate"
                name="initialDate"
                value={newInvestment.initialDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dueDate">Data de Vencimento (opcional)</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={newInvestment.dueDate || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="expectedReturn">Retorno Esperado (% a.a.)</label>
              <input
                type="number"
                id="expectedReturn"
                name="expectedReturn"
                min="0"
                step="0.01"
                value={newInvestment.expectedReturn}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="risk">Nível de Risco</label>
              <select
                id="risk"
                name="risk"
                value={newInvestment.risk}
                onChange={handleInputChange}
              >
                {riskLevels.map((risk, index) => (
                  <option key={index} value={risk}>{risk}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="institution">Instituição</label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={newInvestment.institution}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Observações (opcional)</label>
              <textarea
                id="notes"
                name="notes"
                value={newInvestment.notes || ''}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <button type="submit" className="btn-submit">Adicionar Investimento</button>
          </form>
        </div>
        
        <div className="charts-container">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Distribuição por Tipo</h3>
            </div>
            <div className="chart-body">
              <PieChart data={typeData} />
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-header">
              <h3>Desempenho da Carteira</h3>
            </div>
            <div className="chart-body">
              <LineChart data={performanceData} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="investments-table-container">
        <h3>Lista de Investimentos</h3>
        <div className="investments-list">
          <table className="investments-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Valor Investido</th>
                <th>Valor Atual</th>
                <th>Retorno</th>
                <th>Risco</th>
                <th>Instituição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.length > 0 ? (
                filteredInvestments.map((investment) => {
                  const performances = investmentPerformances[investment.id || 0] || [];
                  const currentValue = performances.length > 0 
                    ? performances[performances.length - 1].value 
                    : investment.amount;
                  const investmentReturn = currentValue - investment.amount;
                  const returnPercent = (investmentReturn / investment.amount) * 100;
                  
                  return (
                    <tr 
                      key={investment.id} 
                      className={selectedInvestment === investment.id ? 'selected-row' : ''}
                      onClick={() => setSelectedInvestment(investment.id || null)}
                    >
                      <td>{investment.name}</td>
                      <td>{investment.type}</td>
                      <td>R$ {investment.amount.toFixed(2)}</td>
                      <td>R$ {currentValue.toFixed(2)}</td>
                      <td className={returnPercent >= 0 ? 'positive-return' : 'negative-return'}>
                        {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%
                      </td>
                      <td>{investment.risk}</td>
                      <td>{investment.institution}</td>
                      <td>
                        <button 
                          className="btn-delete" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInvestment(investment.id || 0);
                          }}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="no-data">Nenhum investimento encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedInvestmentData && (
        <div className="investment-details">
          <h3>Detalhes do Investimento</h3>
          <div className="investment-detail-card">
            <div className="investment-detail-header">
              <h4>{selectedInvestmentData.name}</h4>
              <span className={`risk-badge risk-${selectedInvestmentData.risk.toLowerCase()}`}>
                {selectedInvestmentData.risk}
              </span>
            </div>
            
            <div className="investment-detail-content">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Tipo:</span>
                  <span className="detail-value">{selectedInvestmentData.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Instituição:</span>
                  <span className="detail-value">{selectedInvestmentData.institution}</span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Data Inicial:</span>
                  <span className="detail-value">
                    {new Date(selectedInvestmentData.initialDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Vencimento:</span>
                  <span className="detail-value">
                    {selectedInvestmentData.dueDate 
                      ? new Date(selectedInvestmentData.dueDate).toLocaleDateString('pt-BR')
                      : 'Não aplicável'}
                  </span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Valor Investido:</span>
                  <span className="detail-value">
                    R$ {selectedInvestmentData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Valor Atual:</span>
                  <span className="detail-value">
                    R$ {currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Retorno Esperado:</span>
                  <span className="detail-value">{selectedInvestmentData.expectedReturn}% a.a.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Retorno Atual:</span>
                  <span className={`detail-value ${selectedReturnPercentage >= 0 ? 'positive-return' : 'negative-return'}`}>
                    {selectedReturnPercentage >= 0 ? '+' : ''}{selectedReturnPercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              {selectedInvestmentData.notes && (
                <div className="detail-notes">
                  <span className="detail-label">Observações:</span>
                  <p className="detail-value">{selectedInvestmentData.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentsScreen; 