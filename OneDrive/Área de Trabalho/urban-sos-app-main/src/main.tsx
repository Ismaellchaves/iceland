
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupDatabase } from './database/database.ts'

// Initialize the database
setupDatabase();

createRoot(document.getElementById("root")!).render(<App />);
