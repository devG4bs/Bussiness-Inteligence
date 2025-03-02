import React, { useContext } from 'react';
import '../styles/Header.css';

interface HeaderProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentScreen, setCurrentScreen }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <h1>FinControl</h1>
      </div>
      
      <div className="header-nav">
        <button 
          className={`header-nav-button ${currentScreen === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`header-nav-button ${currentScreen === 'expenses' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('expenses')}
        >
          Despesas
        </button>
        <button 
          className={`header-nav-button ${currentScreen === 'income' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('income')}
        >
          Receitas
        </button>
        <button 
          className={`header-nav-button ${currentScreen === 'cards' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('cards')}
        >
          Cartões
        </button>
        <button 
          className={`header-nav-button ${currentScreen === 'investments' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('investments')}
        >
          Investimentos
        </button>
        <button 
          className={`header-nav-button ${currentScreen === 'whatsapp' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('whatsapp')}
        >
          WhatsApp
        </button>
      </div>
      
      <div className="header-actions">
        <div className="user-profile">
          <div className="user-avatar">
            <span>U</span>
          </div>
          <span className="user-name">Usuário</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 