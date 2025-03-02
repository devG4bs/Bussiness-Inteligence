import React, { useState } from 'react';
import '../styles/WhatsAppIntegration.css';
import { whatsappExamples } from '../data/whatsappExample';

interface WhatsAppIntegrationProps {
  onConnect?: (phoneNumber: string) => void;
  onMessage?: (message: string) => boolean;
}

const WhatsAppIntegration: React.FC<WhatsAppIntegrationProps> = ({ 
  onConnect, 
  onMessage 
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<{ text: string; timestamp: Date; incoming: boolean }[]>([]);
  const [exampleMessage, setExampleMessage] = useState('');

  const handleConnect = () => {
    // Simulação de conexão com WhatsApp
    setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WhatsAppConnection');
    
    // Simulação de conexão bem-sucedida após 3 segundos
    setTimeout(() => {
      setQrCode(null);
      setConnected(true);
      if (onConnect) {
        onConnect(phoneNumber);
      }
      
      // Adicionar algumas mensagens de exemplo
      setMessages([
        { 
          text: 'Olá! Agora você pode registrar despesas pelo WhatsApp.', 
          timestamp: new Date(), 
          incoming: false 
        },
        { 
          text: 'Para adicionar uma despesa, envie no formato: "Despesa: [valor] [categoria] [descrição]"', 
          timestamp: new Date(), 
          incoming: false 
        },
        { 
          text: 'Exemplo: "Despesa: 50.00 Alimentação Almoço no restaurante"', 
          timestamp: new Date(), 
          incoming: false 
        }
      ]);
    }, 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const messageInput = document.getElementById('message-input') as HTMLInputElement;
    const messageText = messageInput.value.trim();
    
    if (messageText) {
      // Adicionar mensagem do usuário
      setMessages(prev => [...prev, { 
        text: messageText, 
        timestamp: new Date(), 
        incoming: false 
      }]);
      
      messageInput.value = '';
      
      // Simular resposta após 1 segundo
      setTimeout(() => {
        let responseText = 'Recebi sua mensagem.';
        
        // Verificar se é uma despesa
        if (messageText.toLowerCase().startsWith('despesa:')) {
          const expensePattern = /despesa:\s+(\d+\.?\d*)\s+([^\d]+?)\s+(.+)/i;
          const match = messageText.match(expensePattern);
          
          if (match) {
            const [, amount, category, description] = match;
            responseText = `✅ Despesa registrada com sucesso!\nValor: R$ ${amount}\nCategoria: ${category.trim()}\nDescrição: ${description.trim()}\n\nOs gráficos do dashboard foram atualizados.`;
          } else {
            responseText = '❌ Formato inválido. Use: "Despesa: [valor] [categoria] [descrição]"';
          }
        }
        
        setMessages(prev => [...prev, { 
          text: responseText, 
          timestamp: new Date(), 
          incoming: true 
        }]);
      }, 1000);
    }
  };

  const handleSimulateMessage = () => {
    if (!connected || !onMessage) return;
    
    // Se não há mensagem de exemplo, use uma aleatória dos exemplos
    const message = exampleMessage || whatsappExamples[Math.floor(Math.random() * whatsappExamples.length)].message;
    
    const success = onMessage(message);
    
    if (!success) {
      alert('Formato de mensagem inválido. Use o formato: "Gasto: [valor] [categoria] [descrição]"');
    }
    
    // Limpar o campo de mensagem
    setExampleMessage('');
  };

  return (
    <div className="whatsapp-integration">
      <h2>Integração com WhatsApp</h2>
      
      {!connected ? (
        <div className="connection-container">
          <p>Conecte seu WhatsApp para enviar e receber atualizações sobre suas finanças.</p>
          
          <div className="phone-input">
            <input
              type="text"
              placeholder="Seu número de telefone com DDD"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button onClick={handleConnect}>Conectar</button>
          </div>
          
          {qrCode && (
            <div className="qr-code-container">
              <p>Escaneie o QR Code com seu WhatsApp:</p>
              <img src={qrCode} alt="QR Code para conexão" />
              <p className="loading">Aguardando conexão...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-contact">
              <div className="contact-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="contact-info">
                <h3>FinControl Assistant</h3>
                <p>Online</p>
              </div>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.incoming ? 'incoming' : 'outgoing'}`}
              >
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              id="message-input"
              type="text"
              placeholder="Digite uma mensagem..."
            />
            <button type="submit">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
      
      <div className="features-list">
        <h3>Recursos disponíveis:</h3>
        <ul>
          <li>
            <i className="fas fa-plus-circle"></i>
            <div>
              <h4>Adicionar despesas</h4>
              <p>Registre despesas enviando mensagens no formato "Despesa: [valor] [categoria] [descrição]"</p>
            </div>
          </li>
          <li>
            <i className="fas fa-chart-pie"></i>
            <div>
              <h4>Receber relatórios</h4>
              <p>Solicite relatórios financeiros enviando "Relatório: [diário/semanal/mensal]"</p>
            </div>
          </li>
          <li>
            <i className="fas fa-bell"></i>
            <div>
              <h4>Alertas automáticos</h4>
              <p>Receba alertas sobre gastos excessivos, vencimentos de contas e oportunidades de economia</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WhatsAppIntegration; 