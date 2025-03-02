import React from 'react';
import '../styles/Dashboard.css';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon }) => {
  const isPositive = !change.includes('-');
  
  // Determinar a classe do ícone com base no título
  const getIconClass = () => {
    if (title.includes('Saldo')) return 'saldo';
    if (title.includes('Receita')) return 'receita';
    if (title.includes('Fatura')) return 'fatura';
    if (title.includes('Economia')) return 'economia';
    return '';
  };
  
  // Determinar o ícone FontAwesome com base no título
  const getFontAwesomeIcon = () => {
    if (title.includes('Saldo')) return 'fa-wallet';
    if (title.includes('Receita')) return 'fa-arrow-up';
    if (title.includes('Fatura')) return 'fa-credit-card';
    if (title.includes('Economia')) return 'fa-piggy-bank';
    return 'fa-chart-line';
  };

  return (
    <div className="kpi-card">
      <div className={`kpi-icon ${getIconClass()}`}>
        <i className={`fas ${getFontAwesomeIcon()}`}></i>
      </div>
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
        <i className={`fas ${isPositive ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
        {change}
      </div>
    </div>
  );
};

export default KPICard; 