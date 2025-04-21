
-- Urban SOS Database Schema

-- Users table for storing citizen and admin information
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  birth_date DATE,
  phone VARCHAR(20),
  address VARCHAR(200),
  city VARCHAR(100) DEFAULT 'Crateús',
  state VARCHAR(2) DEFAULT 'CE',
  is_admin BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add default admin user
INSERT INTO users (name, email, password_hash, is_admin, city, state) 
VALUES ('Prefeitura', 'prefeitura@gmail.com', 'prefeitura123', TRUE, 'Crateús', 'CE');

-- Report categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, icon) VALUES 
  ('Buraco na Via', '🕳️'),
  ('Problema de Iluminação', '💡'),
  ('Descarte Irregular de Lixo', '🗑️'),
  ('Poluição', '💨'),
  ('Problema de Trânsito', '🚦'),
  ('Outros', '📋');

-- Reports table for storing user complaints
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pendente',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_description TEXT,
  address VARCHAR(255),
  city VARCHAR(100) DEFAULT 'Crateús',
  state VARCHAR(2) DEFAULT 'CE',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Status history table to track status changes
CREATE TABLE status_history (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id),
  status VARCHAR(20) NOT NULL,
  changed_by INTEGER REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages between admin and users about reports
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id),
  sender_id INTEGER REFERENCES users(id),
  recipient_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report images table to store multiple images per report
CREATE TABLE report_images (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brazilian states reference table
CREATE TABLE states (
  id SERIAL PRIMARY KEY,
  code VARCHAR(2) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

-- Insert all Brazilian states
INSERT INTO states (code, name) VALUES
  ('AC', 'Acre'),
  ('AL', 'Alagoas'),
  ('AP', 'Amapá'),
  ('AM', 'Amazonas'),
  ('BA', 'Bahia'),
  ('CE', 'Ceará'),
  ('DF', 'Distrito Federal'),
  ('ES', 'Espírito Santo'),
  ('GO', 'Goiás'),
  ('MA', 'Maranhão'),
  ('MT', 'Mato Grosso'),
  ('MS', 'Mato Grosso do Sul'),
  ('MG', 'Minas Gerais'),
  ('PA', 'Pará'),
  ('PB', 'Paraíba'),
  ('PR', 'Paraná'),
  ('PE', 'Pernambuco'),
  ('PI', 'Piauí'),
  ('RJ', 'Rio de Janeiro'),
  ('RN', 'Rio Grande do Norte'),
  ('RS', 'Rio Grande do Sul'),
  ('RO', 'Rondônia'),
  ('RR', 'Roraima'),
  ('SC', 'Santa Catarina'),
  ('SP', 'São Paulo'),
  ('SE', 'Sergipe'),
  ('TO', 'Tocantins');

-- Cities table with state reference
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state_code VARCHAR(2) REFERENCES states(code),
  UNIQUE(name, state_code)
);

-- Insert major cities for Ceará state
INSERT INTO cities (name, state_code) VALUES
  ('Crateús', 'CE'),
  ('Fortaleza', 'CE'),
  ('Juazeiro do Norte', 'CE'),
  ('Sobral', 'CE'),
  ('Caucaia', 'CE'),
  ('Maracanaú', 'CE'),
  ('Crato', 'CE'),
  ('Maranguape', 'CE'),
  ('Itapipoca', 'CE'),
  ('Iguatu', 'CE'),
  ('Quixadá', 'CE');

-- Create indexes for better performance
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_category_id ON reports(category_id);
CREATE INDEX idx_messages_report_id ON messages(report_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_status_history_report_id ON status_history(report_id);
CREATE INDEX idx_cities_state_code ON cities(state_code);
CREATE INDEX idx_report_images_report_id ON report_images(report_id);

-- Add a view for reports with user and category information
CREATE VIEW report_details AS
SELECT 
  r.id, 
  r.title, 
  r.description, 
  r.status, 
  r.latitude, 
  r.longitude, 
  r.location_description,
  r.address,
  r.city,
  r.state, 
  r.image_url,
  r.created_at, 
  r.updated_at,
  u.name as user_name, 
  u.email as user_email,
  c.name as category_name, 
  c.icon as category_icon
FROM 
  reports r
JOIN 
  users u ON r.user_id = u.id
JOIN 
  categories c ON r.category_id = c.id;
