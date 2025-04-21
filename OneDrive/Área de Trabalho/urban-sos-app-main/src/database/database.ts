
/**
 * This file simulates database operations using localStorage
 * In a real application, this would connect to a real SQL database
 */

// Initialize database tables in localStorage if they don't exist
export const initializeDatabase = () => {
  // Check if database is already initialized
  if (localStorage.getItem('db_initialized')) return;
  
  // Initialize users table with admin user
  const adminUser = {
    id: '1',
    name: 'Administrador',
    email: 'prefeitura@gmail.com',
    password: 'prefeitura123', // In a real app, this would be hashed
    city: 'Crateús',
    state: 'CE',
    isAdmin: true,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('users', JSON.stringify([adminUser]));
  
  // Initialize categories
  const categories = [
    { id: 'buraco', name: 'Buraco na Via', icon: '🕳️' },
    { id: 'iluminacao', name: 'Problema de Iluminação', icon: '💡' },
    { id: 'lixo', name: 'Descarte Irregular de Lixo', icon: '🗑️' },
    { id: 'poluicao', name: 'Poluição', icon: '💨' },
    { id: 'transito', name: 'Problema de Trânsito', icon: '🚦' },
    { id: 'outros', name: 'Outros', icon: '📋' }
  ];
  
  localStorage.setItem('categories', JSON.stringify(categories));
  
  // Initialize empty reports array
  localStorage.setItem('reports', JSON.stringify([]));
  
  // Initialize Brazilian states
  const brazilianStates = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
  ];
  
  localStorage.setItem('states', JSON.stringify(brazilianStates));
  
  // Initialize cities for Ceará
  const cearaCities = [
    'Crateús',
    'Fortaleza',
    'Juazeiro do Norte',
    'Sobral',
    'Caucaia',
    'Maracanaú',
    'Crato',
    'Maranguape',
    'Itapipoca',
    'Iguatu',
    'Quixadá'
  ].map(city => ({ name: city, stateCode: 'CE' }));
  
  localStorage.setItem('cities', JSON.stringify(cearaCities));
  
  // Mark database as initialized
  localStorage.setItem('db_initialized', 'true');
};

// Call this in the app's entry point
export const setupDatabase = () => {
  initializeDatabase();
};

// Example of database operations - in a real app these would use SQL queries
export const getReports = () => {
  return JSON.parse(localStorage.getItem('reports') || '[]');
};

export const getReportById = (id: string) => {
  const reports = getReports();
  return reports.find((report: any) => report.id === id) || null;
};

export const createReport = (reportData: any) => {
  const reports = getReports();
  const newReport = {
    id: Date.now().toString(),
    ...reportData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  reports.push(newReport);
  localStorage.setItem('reports', JSON.stringify(reports));
  return newReport;
};

export const updateReportStatus = (id: string, status: string) => {
  const reports = getReports();
  const updatedReports = reports.map((report: any) => {
    if (report.id === id) {
      return { 
        ...report, 
        status, 
        updatedAt: new Date().toISOString() 
      };
    }
    return report;
  });
  
  localStorage.setItem('reports', JSON.stringify(updatedReports));
};

export const deleteReport = (id: string) => {
  const reports = getReports();
  const filteredReports = reports.filter((report: any) => report.id !== id);
  localStorage.setItem('reports', JSON.stringify(filteredReports));
};

// User related functions
export const getUserByEmail = (email: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find((user: any) => user.email === email) || null;
};

export const createUser = (userData: any) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    isAdmin: false,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

export const updateUser = (id: string, userData: any) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const updatedUsers = users.map((user: any) => {
    if (user.id === id) {
      return { ...user, ...userData };
    }
    return user;
  });
  
  localStorage.setItem('users', JSON.stringify(updatedUsers));
};

// Report Images
export const addReportImage = (reportId: string, imageUrl: string, description?: string) => {
  const reportImages = JSON.parse(localStorage.getItem('report_images') || '[]');
  const newImage = {
    id: Date.now().toString(),
    reportId,
    imageUrl,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  
  reportImages.push(newImage);
  localStorage.setItem('report_images', JSON.stringify(reportImages));
  return newImage;
};

export const getReportImages = (reportId: string) => {
  const reportImages = JSON.parse(localStorage.getItem('report_images') || '[]');
  return reportImages.filter((image: any) => image.reportId === reportId);
};

// Location data functions
export const getStates = () => {
  return JSON.parse(localStorage.getItem('states') || '[]');
};

export const getCitiesByState = (stateCode: string) => {
  const cities = JSON.parse(localStorage.getItem('cities') || '[]');
  return cities.filter((city: any) => city.stateCode === stateCode);
};
