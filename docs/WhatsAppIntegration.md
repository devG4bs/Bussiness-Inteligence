# Integração com WhatsApp

Este documento explica como funciona a integração com WhatsApp no sistema de controle financeiro pessoal.

## Visão Geral

A integração com WhatsApp permite que os usuários adicionem despesas diretamente pelo aplicativo de mensagens, enviando mensagens em um formato específico. Isso facilita o registro de gastos no momento em que ocorrem, sem a necessidade de abrir o aplicativo de controle financeiro.

## Como Funciona

1. O usuário conecta seu número de WhatsApp no sistema
2. O usuário envia mensagens no formato específico
3. O sistema processa as mensagens e adiciona as despesas automaticamente

## Formato da Mensagem

As mensagens devem seguir o seguinte formato:

```
Gasto: [valor] [categoria] [descrição]
```

Exemplos:
- `Gasto: 45,90 Alimentação Almoço no restaurante`
- `Gasto: 120,00 Transporte Uber para o aeroporto`
- `Gasto: 2500,00 Moradia Aluguel de maio`

## Categorias Disponíveis

As seguintes categorias são reconhecidas pelo sistema:
- Moradia
- Alimentação
- Transporte
- Lazer
- Saúde
- Educação
- Cartão de Crédito
- Outros

## Implementação Técnica

### Simulador

Na versão atual, a integração com WhatsApp é simulada dentro do próprio aplicativo. O componente `WhatsAppIntegration` inclui um simulador que permite testar o envio de mensagens sem a necessidade de uma conexão real com o WhatsApp.

### Implementação Real

Para uma implementação real, seria necessário:

1. Criar uma API de backend para receber mensagens do WhatsApp
2. Integrar com a API oficial do WhatsApp Business
3. Implementar autenticação e verificação de número de telefone
4. Processar as mensagens recebidas e extrair as informações de despesa
5. Salvar as despesas no banco de dados do usuário

## Fluxo de Dados

1. O usuário envia uma mensagem pelo WhatsApp
2. A mensagem é recebida pela API do WhatsApp Business
3. A API encaminha a mensagem para o backend do sistema
4. O backend processa a mensagem usando expressões regulares para extrair as informações
5. O backend cria um novo registro de despesa no banco de dados
6. O sistema atualiza a interface do usuário para mostrar a nova despesa

## Limitações Atuais

- A integração atual é apenas uma simulação
- Não há conexão real com o WhatsApp
- Os dados são armazenados apenas localmente (localStorage)
- Não há validação avançada das categorias

## Próximos Passos

- Implementar a integração real com a API do WhatsApp Business
- Adicionar suporte para mais formatos de mensagem
- Implementar confirmação de recebimento de despesa
- Adicionar suporte para edição e exclusão de despesas via WhatsApp
- Implementar relatórios periódicos enviados por WhatsApp 