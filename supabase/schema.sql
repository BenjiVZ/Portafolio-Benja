-- ============================================
-- MASTERSLOGIC PORTFOLIO - Supabase Schema
-- Benjamin Velazco
-- ============================================

-- 1. Site Configuration
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT DEFAULT 'web',
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  repo_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'code',
  sort_order INTEGER DEFAULT 0
);

-- 4. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read for portfolio data
CREATE POLICY "Public read site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);

-- Public insert for contact form
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admin full access (para que el panel admin funcione con anon key)
CREATE POLICY "Admin full site_config" ON site_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full contact_messages" ON contact_messages FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- SEED DATA - Benjamin Velazco / MastersLogic
-- ============================================

INSERT INTO site_config (key, value) VALUES
('hero', '{
  "name": "MastersLogic",
  "role": "Desarrollador Full Stack",
  "tagline": "Automatización empresarial, APIs, soporte técnico y soluciones de software a medida",
  "cta_primary": "Ver Proyectos",
  "cta_secondary": "Contactar"
}'::jsonb),
('about', '{
  "title": "Sobre Mí",
  "description": "Desarrollador con más de un año de experiencia y sólida trayectoria en soporte técnico y automatización empresarial. Experto en el diagnóstico de hardware y la implementación de soluciones de software para la mejora de la eficiencia operativa. Dominio de herramientas como Flask, Pandas, n8n y gestión de APIs de SAP. Certificado en Refrigeración N1, Electricidad N1 e inglés (Nivel 7/9), enfocado en la mejora continua y la innovación tecnológica.",
  "image_url": "",
  "skills": ["Python", "JavaScript", "Dart", "Vue", "Flask", "Django", "Flutter", "FastAPI", "PostgreSQL", "MySQL", "Docker", "n8n", "SAP", "TensorFlow", "Rasa", "CrewAI", "HTML", "CSS"]
}'::jsonb),
('contact', '{
  "title": "Contacto",
  "subtitle": "¿Tienes un proyecto en mente? Hablemos.",
  "email": "benjaminvelazco.01@gmail.com",
  "social": {
    "github": "https://github.com/BenjiVZ",
    "linkedin": "https://linkedin.com/in/benjamin-velazco",
    "twitter": ""
  }
}'::jsonb),
('footer', '{
  "copyright": "© 2026 MastersLogic. Todos los derechos reservados.",
  "tagline": "Soluciones tecnológicas a tu medida"
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- Services based on CV specialties
INSERT INTO services (title, description, icon_name, sort_order) VALUES
('Automatización Empresarial', 'Diseño e implemento automatizaciones complejas con n8n, Python y APIs para optimizar flujos de trabajo y procesos internos de tu empresa.', 'server', 1),
('Desarrollo Web & APIs', 'Creo aplicaciones web modernas con Vue, Flask, Django y FastAPI. Integración de APIs de SAP y servicios REST robustos.', 'globe', 2),
('Aplicaciones Móviles', 'Desarrollo apps multiplataforma con Flutter y Dart, con experiencias de usuario fluidas y rendimiento nativo.', 'smartphone', 3),
('Soporte Técnico & TI', 'Diagnóstico de hardware, implementación de sistemas de gestión de TI (osTicket, OCSInventory), y soporte integral de equipos.', 'message-circle', 4);
