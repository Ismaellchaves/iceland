
// Serviço para manipular mensagens entre administradores e cidadãos

export type Message = {
  id: string;
  reportId: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
  createdAt: string;
};

// Salvar uma nova mensagem
export const sendMessage = (message: Omit<Message, 'id' | 'createdAt'>): Message => {
  const messages = getMessages();
  
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  messages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));
  
  return newMessage;
};

// Obter todas as mensagens
export const getMessages = (): Message[] => {
  const messages = localStorage.getItem('messages');
  return messages ? JSON.parse(messages) : [];
};

// Obter mensagens para um relatório específico
export const getMessagesByReportId = (reportId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(msg => msg.reportId === reportId);
};

// Obter mensagens para um usuário específico
export const getMessagesByUserId = (userId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(msg => msg.recipientId === userId || msg.senderId === userId);
};

// Obter mensagens não lidas para um usuário
export const getUnreadMessagesByUserId = (userId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(msg => msg.recipientId === userId && !msg.read);
};

// Marcar mensagem como lida
export const markMessageAsRead = (messageId: string): void => {
  const messages = getMessages();
  const updatedMessages = messages.map(msg => 
    msg.id === messageId ? { ...msg, read: true } : msg
  );
  localStorage.setItem('messages', JSON.stringify(updatedMessages));
};

// Marcar todas as mensagens como lidas para um usuário
export const markAllMessagesAsRead = (userId: string): void => {
  const messages = getMessages();
  const updatedMessages = messages.map(msg => 
    msg.recipientId === userId ? { ...msg, read: true } : msg
  );
  localStorage.setItem('messages', JSON.stringify(updatedMessages));
};

// Função de utilidade para criar uma notificação a partir de uma mensagem
export const createNotificationFromMessage = (message: Message, senderName: string) => {
  return {
    userId: message.recipientId,
    title: `Nova mensagem de ${senderName}`,
    message: message.content.length > 50 
      ? `${message.content.substring(0, 50)}...` 
      : message.content,
    read: false
  };
};
