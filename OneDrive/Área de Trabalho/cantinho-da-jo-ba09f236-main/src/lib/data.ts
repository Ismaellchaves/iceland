import { Appointment } from "@/components/AppointmentCard";
import { Message } from "@/components/ChatMessage";

// Tipos
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  address?: string;
  phone?: string;
  bio?: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  participantIds: string[];
  appointmentId?: string;
  messages: Message[];
}

// Dados iniciais
export const services: Service[] = [ 
{
  id: "1",
  name: "Escova",
  description: "Escova a partir de",
  price: 25.0,
  category: "Cabelo",
  image: "https://th.bing.com/th/id/OIP.IP0V4tbeGM4v3w4DatOh7AHaD2?w=312&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
},
{
  id: "2",
  name: "Hidratação com Escova",
  description: "Hidratação com escova",
  price: 50.0,
  category: "Cabelo",
  image: "https://th.bing.com/th/id/OIP.44ABW0JPwUiGvLX-nQVeAQHaFI?rs=1&pid=ImgDetMain"
},
{
  id: "3",
  name: "ALisamento",
  description: "Lisamento a partir de",
  price: 120.0,
  category: "Alisamento",
  image: "https://th.bing.com/th/id/R.33b5382596f65a85ed626640eb1321d6?rik=x1bqZrMBT0OePg&pid=ImgRaw&r=0"
},
{
  id: "4",
  name: "Sombrancelha",
  description: "Design de sombrancelha",
  price: 15.0,
  category: "Sobrancelhas",
  image: "https://th.bing.com/th/id/R.7c21db4c4478cb08d0ef44e840918b9d?rik=KVgMXIduvmaKmA&pid=ImgRaw&r=0"
},
{
  id: "5",
  name: "Corte",
  description: "Corte apartir de",
  price: 30.0,
  category: "Corte",
  image: "https://th.bing.com/th/id/OIP.P4ZmJPyHnnKHz4NtelAvYgHaKX?rs=1&pid=ImgDetMain"
},
{
  id: "6",
  name: "Aplicação de Tinta",
  description: "Aplicação de tinta",
  price: 30.0,
  category: "Tinta",
  image: "https://th.bing.com/th/id/OIP.FTyQxOABxe8z_vWP-Q2JNgHaE8?rs=1&pid=ImgDetMain"
}
];

export const users: User[] = [
  {
    id: "admin1",
    name: "Cantinho Da Jô",
    email: "cantinhodajo@gmail.com",
    password: "Jo123@#$",
    isAdmin: true,
    image: "/lovable-uploads/6fe4c9ba-d2df-4e06-956a-05990aa080e3.png", // Foto do salão
    createdAt: new Date(2023, 0, 1)
  }
];

export const appointments: Appointment[] = [];

export const chats: Chat[] = [];

// Localização do salão
export const salonLocation = {
  address: "Cantinho da Jô, Rua Coronel Correia, 1132 - Centro, Sobral - CE, 62010-000",
  coordinates: {
    lat: -5.1555983,
    lng: -40.6603031
  },
  openingHours: {
    monday: "8:00 - 21:00",
    tuesday: "8:00 - 21:00",
    wednesday: "8:00 - 21:00",
    thursday: "8:00 - 21:00",
    friday: "8:00 - 21:00",
    saturday: "8:00 - 21:00",
    sunday: "Fechado"
  },
  phone: "(88) 99349-5533"
};

// Funções para manipular dados
export const addUser = (user: Omit<User, "id" | "createdAt" | "isAdmin">): User => {
  const newUser: User = {
    ...user,
    id: `user${users.length + 1}`,
    createdAt: new Date(),
    isAdmin: false
  };
  
  users.push(newUser);
  return newUser;
};

export const authenticateUser = (email: string, password: string): User | null => {
  return users.find(user => user.email === email && user.password === password) || null;
};

export const createAppointment = (
  clientId: string, 
  serviceName: string, 
  price: number,
  date: Date
): Appointment => {
  const client = users.find(user => user.id === clientId);
  
  if (!client) {
    throw new Error("Cliente não encontrado");
  }
  
  const newAppointment: Appointment = {
    id: `app${appointments.length + 1}`,
    clientId,
    clientName: client.name,
    clientImage: client.image,
    serviceName,
    price,
    date,
    status: "pending"
  };
  
  appointments.push(newAppointment);
  
  // Criar um chat para o agendamento
  createChat(clientId, "admin1", newAppointment.id);
  
  return newAppointment;
};

export const updateAppointmentStatus = (
  appointmentId: string, 
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled'
): Appointment | null => {
  const appointment = appointments.find(app => app.id === appointmentId);
  
  if (!appointment) {
    return null;
  }
  
  appointment.status = status;
  return appointment;
};

export const createChat = (
  clientId: string, 
  adminId: string,
  appointmentId?: string
): Chat => {
  const newChat: Chat = {
    id: `chat${chats.length + 1}`,
    participantIds: [clientId, adminId],
    appointmentId,
    messages: []
  };
  
  chats.push(newChat);
  return newChat;
};

export const addMessage = (
  chatId: string,
  content: string,
  senderId: string
): Message | null => {
  const chat = chats.find(c => c.id === chatId);
  
  if (!chat) {
    return null;
  }
  
  const sender = users.find(user => user.id === senderId);
  
  if (!sender) {
    return null;
  }
  
  const newMessage: Message = {
    id: `msg${chat.messages.length + 1}`,
    content,
    senderId,
    senderName: sender.name,
    senderImage: sender.image,
    timestamp: new Date(),
    isAdmin: sender.isAdmin
  };
  
  chat.messages.push(newMessage);
  return newMessage;
};

export const getServicesByCategory = (category: string): Service[] => {
  return services.filter(service => service.category === category);
};

export const getAppointmentsByClientId = (clientId: string): Appointment[] => {
  return appointments.filter(appointment => appointment.clientId === clientId);
};

export const getChatsByUserId = (userId: string): Chat[] => {
  return chats.filter(chat => chat.participantIds.includes(userId));
};

export const getChatByAppointmentId = (appointmentId: string): Chat | null => {
  return chats.find(chat => chat.appointmentId === appointmentId) || null;
};