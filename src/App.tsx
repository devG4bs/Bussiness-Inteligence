import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import WhatsAppIntegration from './components/WhatsAppIntegration';
import ExpensesScreen from './components/ExpensesScreen';
import IncomeScreen from './components/IncomeScreen';
import CreditCardScreen from './components/CreditCardScreen';
import InvestmentsScreen from './components/InvestmentsScreen';
import Header from './components/Header';
import './styles/App.css';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <ExpensesScreen />;
      case 'income':
        return <IncomeScreen />;
      case 'cards':
        return <CreditCardScreen />;
      case 'investments':
        return <InvestmentsScreen />;
      case 'whatsapp':
        return <WhatsAppIntegration />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <div className="main-content">
        <Header currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        <div className="content-wrapper">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

export default App; 