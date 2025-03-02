// Exemplos de mensagens de WhatsApp para adicionar despesas
export const whatsappExamples = [
  {
    message: "Gasto: 45,90 Alimentação Almoço no restaurante",
    parsed: {
      amount: 45.90,
      category: "Alimentação",
      description: "Almoço no restaurante",
      date: new Date().toISOString().substr(0, 10)
    }
  },
  {
    message: "Gasto: 120,00 Transporte Uber para o aeroporto",
    parsed: {
      amount: 120.00,
      category: "Transporte",
      description: "Uber para o aeroporto",
      date: new Date().toISOString().substr(0, 10)
    }
  },
  {
    message: "Gasto: 2500,00 Moradia Aluguel de maio",
    parsed: {
      amount: 2500.00,
      category: "Moradia",
      description: "Aluguel de maio",
      date: new Date().toISOString().substr(0, 10)
    }
  },
  {
    message: "Gasto: 89,90 Lazer Cinema e lanche",
    parsed: {
      amount: 89.90,
      category: "Lazer",
      description: "Cinema e lanche",
      date: new Date().toISOString().substr(0, 10)
    }
  }
];

// Função para analisar mensagens de WhatsApp
export const parseWhatsAppMessage = (message: string) => {
  // Regex para extrair informações da mensagem
  const regex = /Gasto:\s+(\d+[,.]\d+)\s+([^\s]+)\s+(.*)/i;
  const match = message.match(regex);
  
  if (!match) {
    return null;
  }
  
  // Extrair valores
  const amountStr = match[1].replace(',', '.');
  const category = match[2];
  const description = match[3];
  
  // Criar objeto de despesa
  return {
    amount: parseFloat(amountStr),
    category,
    description,
    date: new Date().toISOString().substr(0, 10)
  };
};

// Função para simular o recebimento de mensagens de WhatsApp
export const simulateWhatsAppMessage = (
  phoneNumber: string, 
  message: string, 
  callback: (expense: {
    description: string;
    amount: number;
    category: string;
    date: string;
  }) => void
) => {
  // Analisar a mensagem
  const expense = parseWhatsAppMessage(message);
  
  if (expense) {
    // Chamar o callback com a despesa analisada
    callback(expense);
    return true;
  }
  
  return false;
}; 