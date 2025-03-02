import React, { useState } from 'react';
import '../styles/ExpenseForm.css';

interface ExpenseFormProps {
  onAddExpense: (expense: {
    description: string;
    amount: number;
    category: string;
    date: string;
  }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    onAddExpense({
      description,
      amount: parseFloat(amount),
      category,
      date
    });
    
    // Limpar o formulário
    setDescription('');
    setAmount('');
    setCategory('Alimentação');
    setDate(new Date().toISOString().substr(0, 10));
    
    // Fechar o formulário
    setIsFormVisible(false);
  };

  return (
    <div className="expense-form-container">
      {!isFormVisible ? (
        <button 
          className="add-expense-button"
          onClick={() => setIsFormVisible(true)}
        >
          + Adicionar Despesa
        </button>
      ) : (
        <div className="expense-form-card">
          <div className="expense-form-header">
            <h3>Nova Despesa</h3>
            <button 
              className="close-button"
              onClick={() => setIsFormVisible(false)}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Supermercado, Aluguel, etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Valor (R$)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Moradia">Moradia</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Lazer">Lazer</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Data</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setIsFormVisible(false)}>
                Cancelar
              </button>
              <button type="submit" className="submit-button">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExpenseForm; 