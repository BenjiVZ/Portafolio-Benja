-- Portafolio-Benja · esquema y datos para Supabase
-- Generado desde src/data/*.json — 31 proyectos, 3 experiencias, 5 flyers, 21 skills
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run

-- ==================== TABLAS ====================
create table if not exists projects (
  id bigserial primary key,
  title text not null,
  description text,
  short_description text,
  category text,
  subcategory text,
  tech_stack text[] default '{}',
  sub_skills text[] default '{}',
  live_url text,
  repo_url text,
  featured boolean default false,
  hidden boolean default false,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);
-- Bases creadas antes de 2026-09-08: anade la columna de ocultar
alter table projects add column if not exists hidden boolean default false;

create table if not exists services (
  id bigserial primary key,
  title text not null,
  description text,
  icon_name text,
  sort_order int default 0
);

create table if not exists experiences (
  id bigserial primary key,
  title text not null,
  company text,
  location text,
  period text,
  is_current boolean default false,
  tasks text[] default '{}',
  techs text[] default '{}',
  sort_order int default 0
);

create table if not exists flyers (
  id bigserial primary key,
  title text not null,
  tag text,
  image_url text,
  sort_order int default 0
);

create table if not exists site_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists testimonials (
  id bigserial primary key,
  name text not null,
  role text,
  company text,
  content text,
  avatar_url text,
  sort_order int default 0
);

create table if not exists contact_messages (
  id bigserial primary key,
  name text,
  email text,
  subject text,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

-- ==================== RLS ====================
-- Sin estas políticas el sitio conecta pero devuelve listas vacías.
--
-- ATENCION: el panel /admin se protege con VITE_ADMIN_PASSWORD, que viaja
-- en el bundle del navegador. El cliente actua siempre como rol anon, asi
-- que la ESCRITURA tiene que estar abierta a anon para que el panel guarde.
-- Consecuencia: cualquiera con la clave publicable puede escribir en estas
-- tablas, aunque no vea el formulario. Haz backups periodicos.
-- Para cerrarlo de verdad hace falta validar la clave en el servidor
-- (Supabase Edge Function) o volver a Supabase Auth con login real.

alter table projects enable row level security;
drop policy if exists "lectura publica" on projects;
create policy "lectura publica" on projects for select to anon, authenticated using (true);
drop policy if exists "escritura autenticada" on projects;
drop policy if exists "escritura panel" on projects;
create policy "escritura panel" on projects for all to anon, authenticated using (true) with check (true);

alter table services enable row level security;
drop policy if exists "lectura publica" on services;
create policy "lectura publica" on services for select to anon, authenticated using (true);
drop policy if exists "escritura autenticada" on services;
drop policy if exists "escritura panel" on services;
create policy "escritura panel" on services for all to anon, authenticated using (true) with check (true);

alter table experiences enable row level security;
drop policy if exists "lectura publica" on experiences;
create policy "lectura publica" on experiences for select to anon, authenticated using (true);
drop policy if exists "escritura autenticada" on experiences;
drop policy if exists "escritura panel" on experiences;
create policy "escritura panel" on experiences for all to anon, authenticated using (true) with check (true);

alter table flyers enable row level security;
drop policy if exists "lectura publica" on flyers;
create policy "lectura publica" on flyers for select to anon, authenticated using (true);
drop policy if exists "escritura autenticada" on flyers;
drop policy if exists "escritura panel" on flyers;
create policy "escritura panel" on flyers for all to anon, authenticated using (true) with check (true);

alter table site_config enable row level security;
drop policy if exists "lectura publica" on site_config;
create policy "lectura publica" on site_config for select to anon, authenticated using (true);
drop policy if exists "escritura autenticada" on site_config;
drop policy if exists "escritura panel" on site_config;
create policy "escritura panel" on site_config for all to anon, authenticated using (true) with check (true);

alter table testimonials enable row level security;
drop policy if exists "lectura publica" on testimonials;
create policy "lectura publica" on testimonials for select to anon, authenticated using (true);
drop policy if exists "escritura autenticada" on testimonials;
drop policy if exists "escritura panel" on testimonials;
create policy "escritura panel" on testimonials for all to anon, authenticated using (true) with check (true);

-- Mensajes de contacto: cualquiera envía, solo tú lees
alter table contact_messages enable row level security;
drop policy if exists "envio publico" on contact_messages;
create policy "envio publico" on contact_messages for insert to anon, authenticated with check (true);
drop policy if exists "lectura privada" on contact_messages;
create policy "lectura privada" on contact_messages for select to authenticated using (true);
drop policy if exists "gestion privada" on contact_messages;
create policy "gestion privada" on contact_messages for update to authenticated using (true);
drop policy if exists "borrado privado" on contact_messages;
create policy "borrado privado" on contact_messages for delete to authenticated using (true);

-- ==================== DATOS ====================

-- 31 proyectos
truncate projects restart identity cascade;
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (28,'Ivoo Ventas - App de apoyo comercial','Aplicación móvil para el equipo de ventas de Ivoo. Permite registrar ventas del día, generar reportes por tipo de venta, administrar cartera de clientes, calcular caja y descuentos, y actualizar el tipo de cambio BCV.','App móvil para control diario de ventas, clientes y caja en Ivoo.','personal',ARRAY['Dart','Flutter'],'','',true,'',1);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (26,'App Móvil de Combinación de Outfits con IA','Aplicación móvil innovadora que utiliza inteligencia artificial y visión computacional para recomendar combinaciones de ropa y colores basándose en el guardarropa personal del usuario, ocasiones específicas y tendencias de moda actuales.
                
Funcionalidades planificadas:
- Escaneo y catalogación automática del guardarropa personal
- Recomendaciones personalizadas usando algoritmos de machine learning
- Análisis de colores y estilos compatibles
- Sugerencias basadas en clima, ocasión y tendencias
- Integración con tiendas online para compras sugeridas
- Comunidad social para compartir outfits y obtener feedback
- Asistente virtual fashion con procesamiento de lenguaje natural
- Realidad aumentada para probador virtual
- Análisis de estilo personal y evolución en el tiempo
- Integración con redes sociales para inspiración
                
En fase de investigación y diseño, con lanzamiento planificado para Q3 2025.','App de recomendación de outfits con inteligencia artificial','future',ARRAY['OpenCV'],'','',false,'',1);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (35,'Implementación de osTicket','Participación en la implementación de osTicket para gestión de solicitudes TI en A.S 28 La Candelaria (Constructora - Sambil).','Soporte en implementación de mesa de ayuda TI.','internship',ARRAY['osTicket'],'','',false,'',1);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (14,'E-commerce con Django en Google IDX/Firebase Studio','Desarrollo completo de una plataforma e-commerce utilizando Django como framework principal y Google IDX/Firebase Studio para el despliegue y gestión de la base de datos. 
                
La plataforma incluye:
- Sistema completo de gestión de productos con categorías
- Carrito de compras funcional con persistencia de sesión
- Sistema de usuarios con registro y autenticación
- Panel de administración para gestión de inventario
- Integración con sistemas de pago
- Diseño responsive y optimizado para dispositivos móviles
- Base de datos escalable con Firebase
                
Este proyecto me permitió profundizar en el desarrollo full-stack con Django y la integración con servicios cloud de Google.','Plataforma e-commerce completa con Django y Firebase Studio','university',ARRAY['Bootstrap','CSS','Django','Firebase','Google IDX','HTML','JavaScript','Python','SQLite'],'','',true,'',1);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (20,'Sistema de Puntos de Fidelización Hotelera','Sistema integral para la gestión de programas de fidelización en cadenas hoteleras, diseñado para incrementar la lealtad de los huéspedes y optimizar las estrategias de marketing hotelero.
                
Módulos del sistema:
- Dashboard administrativo para hoteles con métricas en tiempo real
- Aplicación móvil para huéspedes con Flutter
- Sistema de acumulación y canje de puntos automático
- Programa de beneficios por niveles (Bronze, Silver, Gold, Platinum)
- Integración con sistemas PMS hoteleros existentes
- Notificaciones push personalizadas
- Geolocalización para ofertas contextuales
- Análisis predictivo de comportamiento de huéspedes
- API REST para integración con terceros
- Panel de reportes y analytics avanzados
                
Implementado actualmente en 3 hoteles piloto con más de 1,000 usuarios activos.','Sistema completo de fidelización para cadenas hoteleras','personal',ARRAY['Analytics','Dart','Django','Firebase','Flutter','JWT','MySQL','Python','REST API'],'','',true,'',1);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (29,'Damasco IA - Chat Gemini conectado a la base de datos','Sistema de chat con Gemini integrado a la base de datos de Damasco. Responde en tiempo real con información de productos, ventas y operaciones, con respuestas contextualizadas para el equipo interno.','Chat corporativo con Gemini para consultar información de Damasco en tiempo real.','sistemas',ARRAY['Django','PostgreSQL','Python'],'','',true,'',2);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (27,'Servidor Asterisk con FreePBX','Implementación completa de un servidor de telefonía IP empresarial basado en Asterisk con interfaz gráfica FreePBX, completamente containerizado con Docker para facilitar el despliegue, escalabilidad y mantenimiento en entornos empresariales.
                
Características técnicas planificadas:
- Implementación completa de Asterisk en contenedores Docker
- Interfaz web FreePBX para administración simplificada
- Configuración automática de extensiones y troncales SIP
- Sistema de grabación de llamadas con almacenamiento en la nube
- IVR (Interactive Voice Response) personalizable
- Integración con CRM para pop-up de información de clientes
- Dashboard de métricas de llamadas en tiempo real
- Failover automático para alta disponibilidad
- Configuración multi-tenant para múltiples empresas
- API REST para integraciones con sistemas externos
- Sistema de backup automático de configuraciones
- Monitoreo proactivo con alertas automatizadas
                
Proyecto dirigido a PYMEs que buscan modernizar su infraestructura de telecomunicaciones.','Servidor de telefonía IP empresarial containerizado','future',ARRAY['Asterisk','Docker','Docker Compose','FreePBX','Linux','Networking','SIP','VoIP'],'','',false,'',2);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (36,'Implementación de OCSInventory','Apoyo en la implementación de OCSInventory para inventario y control de activos TI en A.S 28 La Candelaria (Constructora - Sambil).','Soporte en inventario de activos TI.','internship',ARRAY['OCSInventory'],'','',false,'',2);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (21,'Asistente Virtual Turístico de Mérida','Asistente virtual especializado e inteligente para información turística de la ciudad de Mérida, Venezuela, utilizando procesamiento de lenguaje natural para proporcionar recomendaciones personalizadas.
                
Capacidades del asistente:
- Base de conocimiento completa sobre Mérida y sus atractivos
- Recomendaciones personalizadas de lugares turísticos
- Información actualizada sobre restaurantes y gastronomía local
- Sugerencias de hoteles y hospedajes por presupuesto
- Itinerarios personalizados según intereses y tiempo disponible
- Información climática y consejos de vestimenta
- Integración con servicios de transporte local
- Soporte multiidioma (español e inglés)
- Interfaz conversacional natural con RASA
- Geolocalización y mapas interactivos
                
Desarrollado como contribución al turismo local de Mérida, con más de 500 consultas procesadas mensualmente.','Asistente IA especializado en turismo merideño','personal',ARRAY['Bootstrap','Flask','Geolocation API','JavaScript','NLP','Python','RASA'],'','',false,'',2);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (15,'Videojuego con PYQT5 y PyGame','Desarrollo de un videojuego interactivo completo utilizando las librerías PYQT5 para la interfaz gráfica de usuario y PyGame para la lógica del juego y renderizado.
                
Características del juego:
- Interfaz gráfica intuitiva desarrollada con PYQT5
- Motor de juego implementado con PyGame
- Sistema de puntuación y niveles progresivos
- Efectos de sonido y música de fondo
- Gráficos 2D personalizados
- Sistema de guardado de progreso
- Múltiples personajes y enemigos
- Física básica para movimientos y colisiones
                
Este proyecto me ayudó a comprender los conceptos de programación orientada a objetos y desarrollo de interfaces gráficas en Python.','Videojuego interactivo desarrollado con Python','university',ARRAY['Game Development','OOP','PyGame','PyQT5','Python','Sound Programming'],'','',false,'',2);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (30,'Damasco Ventas Live - Reportes en el momento','Aplicación para el monitoreo de ventas en el momento en Damasco. Provee reportes instantáneos del día, métricas clave y vistas rápidas para apoyar decisiones comerciales.','App de reportes de ventas en tiempo real para apoyo comercial.','sistemas',ARRAY['Dart','Flutter'],'','',true,'',3);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (45,'Damasco Auditoria - Sistema de Control y Auditoria','Sistema integral de auditoria desarrollado para Damasco, diseñado para garantizar el control, la transparencia y la trazabilidad de las operaciones empresariales.

El sistema se integra directamente con SAP para extraer y validar datos en tiempo real, permitiendo a los auditores internos verificar transacciones, detectar inconsistencias y generar reportes de cumplimiento.

Características principales:
• Integración bidireccional con SAP para consulta de datos de ventas, inventario y finanzas
• Dashboard de auditoria con indicadores clave y alertas automáticas
• Registro de hallazgos y seguimiento de acciones correctivas
• Generación de reportes de auditoria en PDF
• Control de acceso por roles (auditor, supervisor, gerencia)
• Historial completo de auditorias realizadas con trazabilidad
• Módulo de verificación cruzada de datos entre sistemas','Sistema de auditoria empresarial con integración SAP para control y trazabilidad','sistemas',ARRAY['Django','PDF Generation','PostgreSQL','Python','REST API','SAP'],'','',true,'',3);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (22,'App Móvil: Listas de Compras y Gestión de Stock Hotelero','Aplicación multiplataforma desarrollada con Flutter para la gestión eficiente de listas de compras y control de inventario en establecimientos hoteleros de pequeña y mediana escala.
                
Funcionalidades principales:
- Gestión de listas de compras inteligentes con sugerencias automáticas
- Control de inventario en tiempo real por categorías
- Sistema de alertas por stock mínimo y fechas de vencimiento
- Generación automática de órdenes de compra
- Sincronización multi-dispositivo con Firebase
- Escáner de códigos de barras para registro rápido
- Reportes de consumo y análisis de tendencias
- Gestión de proveedores y precios comparativos
- Sistema de usuarios por roles (administrador, encargado, staff)
- Integración con sistemas contables básicos
- Funcionalidad offline con sincronización posterior
                
Implementada en 5 hoteles boutique con reducción del 30% en desperdicio de alimentos.','App integral para gestión de inventario hotelero','personal',ARRAY['Barcode Scanner','Dart','Firebase','Flutter','Material Design','Provider','SQLite'],'','',true,'',3);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (37,'Automatización de reportes internos','Desarrollo de herramientas internas con Python (Flask, Pandas) para automatización de reportes del centro comercial.','Herramientas internas para reportes del centro comercial.','internship',ARRAY['Flask','Pandas','Python'],'','',false,'',3);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (16,'Aplicación GUI con Electron','Aplicación de escritorio completa con interfaz gráfica desarrollada en Python utilizando la librería Tkinter nativa. La aplicación implementa un sistema de gestión de datos con múltiples funcionalidades.
                
Funcionalidades principales:
- Interfaz gráfica intuitiva y profesional
- Sistema CRUD completo (Create, Read, Update, Delete)
- Validación robusta de formularios
- Conexión y gestión de base de datos SQLite
- Sistema de backup y restauración de datos
- Gestión de Proyectos 
                
Este proyecto me permitió dominar el desarrollo de aplicaciones de escritorio y la gestión de bases de datos locales.','Aplicación de escritorio con interfaz gráfica completa','university',ARRAY['Database Management','GUI Design','PDF Generation','Python','SQLite','Tkinter'],'','',false,'',3);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (31,'Verozh Spa Yoga - Control de clases','Sistema web para Verozh Spa que automatiza la asignación de profesoras y fechas de clases, gestiona cupos y facilita la organización del calendario de yoga.','Sistema para programación y control de clases de yoga.','personal',ARRAY['Django','PostgreSQL','Python'],'','',true,'',4);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (46,'Damasco Fidelización - Gestión de Socios de Negocios','Plataforma de gestión de socios de negocios y programa de fidelización para Damasco, con integración directa al sistema SAP para la sincronización de datos comerciales.

El sistema permite visualizar en tiempo real los créditos de cada socio de negocios, registrar y validar pagos, y mantener un control exhaustivo de las relaciones comerciales.

Funcionalidades principales:
• Visualización de créditos y saldos de socios de negocios en tiempo real
• Registro y validación de pagos con flujo de aprobación
• Integración con SAP para sincronización de datos de socios y transacciones
• Panel de control con métricas de fidelización y comportamiento de socios
• Sistema de alertas para pagos vencidos y créditos próximos a vencer
• Historial completo de transacciones por socio de negocios
• Reportes de estado de cuenta y conciliación
• Gestión de niveles de fidelización basados en volumen de compras','Gestión de créditos, pagos y fidelización de socios de negocios con integración SAP','sistemas',ARRAY['Django','PostgreSQL','Python','REST API','SAP'],'','',true,'',4);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (23,'Sistema Web de Gestión Técnica e Inventario SINPEL','Plataforma web integral desarrollada específicamente para SINPEL, enfocada en la gestión eficiente de casos de garantía, inventario de repuestos y seguimiento de reparaciones técnicas de equipos de línea blanca y marrón.
                
Módulos implementados:
- Dashboard ejecutivo con KPIs en tiempo real
- Gestión completa de casos de garantía con workflow automatizado
- Inventario inteligente de repuestos con alertas automáticas
- Sistema de asignación de técnicos por zona geográfica
- Seguimiento detallado de reparaciones con fotos y diagnósticos
- Generación automática de reportes operativos y gerenciales
- Sistema de facturación y cobranza integrado
- Portal del cliente para seguimiento de casos
- Integración con WhatsApp para notificaciones
- Analytics predictivo para planificación de inventario
- Sistema de evaluación de técnicos y calidad de servicio
                
Sistema en producción manejando 200+ casos mensuales con mejora del 40% en tiempos de respuesta.','Sistema integral para gestión técnica y garantías','personal',ARRAY['Bootstrap','Chart.js','Django','PDF Generation','PostgreSQL','Python','WhatsApp API'],'','',true,'',4);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (17,'Calculadora de Traslación y Rotación 2D/3D','Herramienta matemática avanzada desarrollada en Google Colab para el cálculo y visualización de transformaciones geométricas en espacios bidimensionales y tridimensionales.
                
Capacidades de la calculadora:
- Cálculo de traslaciones en 2D y 3D
- Rotaciones con ángulos personalizables
- Escalado y transformaciones compuestas
- Visualización gráfica interactiva de las transformaciones
- Interfaz web intuitiva en Jupyter Notebook
- Exportación de resultados y gráficos
- Soporte para matrices de transformación
- Animaciones de las transformaciones step-by-step
                
Desarrollada como herramienta de apoyo para materias de matemáticas y gráficos computacionales, utilizando bibliotecas científicas de Python.','Calculadora avanzada para transformaciones geométricas 2D/3D','university',ARRAY['Google Colab','Gráficos 3D','Jupyter','Matemáticas Aplicadas','Matplotlib','NumPy','Python'],'','',false,'',4);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (32,'Verozh Spa - Historial clínico y consultas','Sistema de control clínico para Verozh Spa con registro de historial del paciente, seguimiento de consultas y programación de fechas.','Gestión de historias clínicas y citas médicas.','personal',ARRAY['Django','PostgreSQL','Python'],'','',true,'',5);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (24,'Sistema Integral de Gestión Comercial CSEN','Plataforma completa de gestión empresarial desarrollada para CSEN, diseñada para automatizar y optimizar todos los procesos comerciales, desde la gestión de inventarios hasta el análisis de ventas y CRM.
                
Arquitectura del sistema:
- Módulo de inventario con control multi-almacén
- Sistema CRM con seguimiento completo del pipeline de ventas
- Facturación electrónica con integración SENIAT
- Gestión de proveedores y órdenes de compra automatizadas
- Control de cuentas por cobrar y por pagar
- Dashboard gerencial con métricas de negocio en tiempo real
- Sistema de comisiones para vendedores
- Gestión de productos con códigos de barras
- Reportes financieros y operativos automatizados
- API REST para integraciones con sistemas externos
- Sistema de backup automático y recuperación de desastres
- Módulo de nómina básica integrada
                
Implementado para empresa con 50+ empleados, procesando 500+ transacciones diarias.','ERP completo para gestión comercial empresarial','personal',ARRAY['Celery','Django','Docker','MySQL','Python','REST API','Redis','Vue.js'],'','',true,'',5);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (18,'E-commerce con Django','Plataforma e-commerce robusta desarrollada completamente con Django, enfocada en las mejores prácticas de desarrollo web y arquitectura escalable.
                
Arquitectura y funcionalidades:
- Arquitectura MVT (Model-View-Template) bien estructurada
- Sistema de autenticación y autorización avanzado
- Gestión completa de inventario y productos
- Carrito de compras con persistencia de sesión
- Sistema de órdenes y facturación
- Panel de administración personalizado
- API REST para integración con terceros
- Optimización SEO y rendimiento
- Testing automatizado con cobertura completa
                
Este proyecto consolidó mis conocimientos en Django y desarrollo web profesional.','Plataforma e-commerce robusta con arquitectura escalable','university',ARRAY['CSS','Django','HTML','JavaScript','PostgreSQL','Python','REST API','Testing'],'','',true,'',5);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (33,'Monitor Cambiario VE - Dólar, euro y cripto','Aplicación de monitoreo de cambio en Venezuela para dólar, euro, USDT y USDC. Incluye calculadora de conversión y gráficas de variación en 1 semana, 1 mes y 1 año.','App con tasas actualizadas y calculadora multi-moneda.','personal',ARRAY['Dart','Flutter'],'','',true,'',6);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (25,'Sistema de Consolidación de Precios y Preventas IVOO','Sistema especializado para IVOO enfocado en la consolidación automática de precios de múltiples proveedores y la gestión inteligente de preventas comerciales con algoritmos de optimización avanzados.
                
Componentes técnicos:
- Algoritmos de web scraping para captura automática de precios
- Sistema de machine learning para predicción de tendencias de precios
- Consolidación inteligente de datos de múltiples fuentes
- Dashboard de comparación de precios en tiempo real
- Sistema automatizado de generación de preventas
- Análisis predictivo para optimización de márgenes de ganancia
- Alertas automáticas de cambios significativos en precios
- Integración con sistemas de inventario existentes
- Módulo de análisis de competencia
- API para integración con sistemas POS
- Reportes ejecutivos con visualizaciones interactivas
- Sistema de auditoría para trazabilidad de cambios
                
Sistema procesando 10,000+ comparaciones de precios diarias con mejora del 25% en márgenes.','Sistema IA para consolidación de precios y preventas','personal',ARRAY['Celery','Django','Machine Learning','NumPy','Pandas','PostgreSQL','Python','Scrapy'],'','',true,'',6);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (19,'E-commerce y Asistente virtual con Django y RASA','Plataforma e-commerce avanzada integrada con un asistente virtual inteligente desarrollado con RASA para proporcionar una experiencia de compra conversacional y personalizada.
                
Componentes del sistema:
- Plataforma e-commerce completa con Django
- Asistente virtual con procesamiento de lenguaje natural
- Integración RASA para comprensión de intenciones
- Chatbot contextual para recomendaciones de productos
- Sistema de machine learning para personalización
- Base de conocimiento dinámica
- Análisis de sentimientos en conversaciones
- Multi-idioma (español e inglés)
- Integración con sistemas de pago conversacionales
                
Proyecto de tesis que combina e-commerce tradicional con IA conversacional para crear una experiencia de usuario innovadora.','E-commerce con asistente virtual inteligente usando IA','university',ARRAY['Chatbot','Django','Machine Learning','NLP','PostgreSQL','Python','RASA','TensorFlow'],'','',true,'',6);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (34,'Sistema de Nómina Modular','Plataforma modular para gestionar contratación, cálculo de nómina, asistencia, liquidaciones y dispersión de pagos, con reportes y autoservicio para empleados.','Sistema de nómina con módulos de identidad, cálculo y control de tiempo.','personal',ARRAY['Django','PostgreSQL','Python'],'','',true,'',7);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (47,'Cloud de Archivos - Almacenamiento Personal en la Nube','Plataforma de almacenamiento en la nube personal con dominio propio gestionado a través de Cloudflare, acompañada de una aplicación de escritorio desarrollada con Electron.

El backend está construido con Django REST Framework, proporcionando una API robusta para la gestión de archivos, mientras que la aplicación de escritorio ofrece una experiencia nativa para la sincronización y gestión de documentos.

Características principales:
• Almacenamiento seguro de archivos en servidor propio
• Dominio personalizado con Cloudflare (DNS, SSL, CDN)
• Aplicación de escritorio con Electron para subir, descargar y organizar archivos
• API REST completa para operaciones CRUD de archivos
• Sistema de carpetas y organización de documentos
• Previsualización de archivos multimedia
• Control de acceso y compartición de archivos
• Sincronización automática entre escritorio y nube','Nube personal de archivos con app de escritorio Electron y Django REST API','personal',ARRAY['Cloudflare','Django REST Framework','Electron','JavaScript','Python'],'','',true,'',12);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (48,'Cloud de Música - Reproductor Personal en la Nube','Servicio de streaming de música personal desplegado en un dominio propio con Cloudflare, con una aplicación móvil que funciona como reproductor y un backend en Django REST API.

Permite subir, organizar y reproducir tu colección musical desde cualquier lugar, con una app móvil dedicada que ofrece una experiencia de reproducción fluida.

Características principales:
• Cloud de música con dominio propio protegido por Cloudflare
• Aplicación móvil como reproductor con controles completos de audio
• Backend Django REST API para gestión de biblioteca musical
• Subida y organización de canciones por artista, álbum y género
• Reproductor con cola de reproducción, shuffle y repetición
• Streaming de audio optimizado para conexiones móviles
• Listas de reproducción personalizables
• Búsqueda y filtrado avanzado de canciones','Streaming de música personal con app móvil reproductora y Django REST API','personal',ARRAY['Cloudflare','Dart','Django REST Framework','Flutter','Python'],'','',true,'',13);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (49,'CSEN v2 - Migración a Django REST API y Vue.js','Segunda versión del Sistema Integral de Gestión Comercial CSEN, migrado desde una arquitectura monolítica de Django con HTML, CSS y JavaScript puro, hacia una arquitectura moderna de API REST con Django REST Framework en el backend y Vue.js como framework frontend consumidor de la API.

Esta migración permite una separación completa entre backend y frontend, mejorando la escalabilidad, mantenibilidad y experiencia de usuario.

Mejoras respecto a v1:
• Backend completamente API REST con Django REST Framework
• Frontend SPA con Vue.js consumiendo la API
• Autenticación basada en tokens JWT
• Interfaz de usuario más fluida y reactiva sin recargas de página
• Mejor separación de responsabilidades (frontend/backend)
• Mayor facilidad para integrar apps móviles en el futuro
• Documentación automática de la API con Swagger/OpenAPI
• Tests automatizados para endpoints de la API','Migración del sistema CSEN de Django monolítico a Django REST API + Vue.js','personal',ARRAY['Django REST Framework','JWT','JavaScript','MySQL','Python','REST API','Vue.js'],'','',true,'',14);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (50,'Sistema de Inventario y Menú Web para Tintos y Café','Sistema de gestión de inventario especializado para establecimientos de café y tintos, con menú web integrado para clientes y un módulo completo de costeo de platillos.

Permite organizar los ingredientes de cada platillo del menú, calcular automáticamente el costo total basándose en el precio unitario de cada ingrediente, y gestionar el inventario de insumos.

Funcionalidades principales:
• Menú web interactivo para clientes con precios y descripciones
• Registro de ingredientes con precios unitarios actualizables
• Composición de platillos: asignación de ingredientes y cantidades
• Cálculo automático del costo total de cada platillo
• Análisis de margen de ganancia por producto
• Control de inventario de ingredientes con alertas de stock bajo
• Historial de precios de ingredientes para análisis de costos
• Interfaz responsiva adaptada para tablets en cocina','Inventario de café con menú web, costeo de ingredientes y cálculo de precios','personal',ARRAY['Bootstrap','Django','JavaScript','PostgreSQL','Python'],'','',true,'',15);
insert into projects (id,title,description,short_description,category,tech_stack,live_url,repo_url,featured,image_url,sort_order) values (51,'Smart Inventory - Plataforma de Gestión Logística Inteligente','Plataforma digital diseñada para digitalizar y centralizar la logística empresarial. Smart Inventory ofrece una solución integral para el control de inventarios, automatización de procesos y trazabilidad de operaciones.

El sistema se basa en cuatro pilares fundamentales:

Control Centralizado:
Gestión de múltiples almacenes o bodegas desde un solo lugar, con rastreo en tiempo real de la ubicación de cada producto.

Automatización de Inventario:
Vigilancia automática de niveles de stock. El sistema envía alertas automáticas cuando un producto está por agotarse, previniendo quiebres de stock.

Seguridad y Auditoría:
Supervisión de accesos al sistema y cambios realizados mediante roles de usuario, garantizando transparencia y autorización en los movimientos de mercancía.

Contabilidad Logística (Kardex):
Generación de reportes detallados de entradas, salidas y saldos, facilitando el control de costos y la toma de decisiones basada en datos reales.','Plataforma logística con control centralizado, automatización y Kardex','personal',ARRAY['Bootstrap','Chart.js','Django','PDF Generation','PostgreSQL','Python','REST API'],'','',true,'',16);
select setval('projects_id_seq', (select coalesce(max(id),1) from projects));

-- 4 servicios
truncate services restart identity;
insert into services (title,description,icon_name,sort_order) values ('Desarrollo Web','Creo aplicaciones web modernas, responsivas y de alto rendimiento usando las últimas tecnologías.','globe',1);
insert into services (title,description,icon_name,sort_order) values ('Desarrollo Backend','Diseño e implemento APIs robustas, bases de datos optimizadas y arquitecturas escalables.','server',2);
insert into services (title,description,icon_name,sort_order) values ('Aplicaciones Móviles','Desarrollo apps nativas y multiplataforma con experiencias de usuario fluidas.','smartphone',3);
insert into services (title,description,icon_name,sort_order) values ('Consultoría Tech','Te ayudo a elegir las mejores tecnologías y arquitecturas para tu proyecto.','message-circle',4);

-- 3 experiencias
truncate experiences restart identity;
insert into experiences (title,company,location,period,is_current,tasks,sort_order) values ('Desarrollador','Damasco','Caracas, Venezuela','Ene 2026 — Actualidad',true,ARRAY['• Desarrollo de soluciones tecnológicas para la automatización de flujos de trabajo y procesos internos.','• Integración de API de SAP con software a medida para la sincronización y optimización de datos.','• Diseño e implementación de automatizaciones complejas utilizando n8n.','• Diagnóstico y optimización de procesos operativos, incrementando la eficiencia de la empresa.'],1);
insert into experiences (title,company,location,period,is_current,tasks,sort_order) values ('Técnico en Garantía','SIMAX (IVOO)','Caracas, Venezuela','Jun 2025 — Ene 2026',false,ARRAY['• Gestión integral de casos de garantía, desde la recepción del cliente hasta la resolución final.','• Diagnóstico y reparación de equipos.','• Soporte técnico y reparación de productos de tecnología.','• Uso de sistemas internos para la gestión de inventario de repuestos y seguimiento de casos.'],2);
insert into experiences (title,company,location,period,is_current,tasks,sort_order) values ('Pasante de Informática','A.S 28 La Candelaria (Constructora - Sambil)','Caracas, Venezuela','Oct 2024 — Nov 2024',false,ARRAY['Soporte especializado y desarrollo de soluciones tecnológicas:','• Soporte en la implementación de sistemas de gestión de TI (osTicket, OCSInventory)','• Desarrollo de herramientas internas personalizadas con Python utilizando Flask y Pandas','• Automatización de reportes del centro comercial para optimizar procesos administrativos','• Colaboración en proyectos de infraestructura tecnológica y soporte técnico','• Documentación técnica y capacitación de usuarios finales','• Automatización exitosa reduciendo tiempo de generación de reportes en 60%'],2);

-- 5 flyers
truncate flyers restart identity;
insert into flyers (title,tag,image_url,sort_order) values ('CSEN','','https://1000.masterslogic.com/media/flyers/1.png',1);
insert into flyers (title,tag,image_url,sort_order) values ('Inventario','','https://1000.masterslogic.com/media/flyers/2.png',2);
insert into flyers (title,tag,image_url,sort_order) values ('Pre Ventas','','https://1000.masterslogic.com/media/flyers/3.png',3);
insert into flyers (title,tag,image_url,sort_order) values ('Desarrollo','','https://1000.masterslogic.com/media/flyers/5.png',4);
insert into flyers (title,tag,image_url,sort_order) values ('Tecnico','','https://1000.masterslogic.com/media/flyers/4.png',5);

-- configuración del sitio (hero, about, contacto, footer)
delete from site_config;
insert into site_config (key,value) values ('hero', '{"name":"Benjamin Velazco","role":"Desarrollador | Técnico en Informática","tagline":"Desarrollador con más de un año de experiencia en soporte técnico y automatización empresarial. Experto en diagnóstico de hardware e implementación de soluciones de software.","cta_primary":"Ver Proyectos","cta_secondary":"Contactar"}'::jsonb);
insert into site_config (key,value) values ('about', '{"title":"Sobre Mí","description":"Desarrollador Backend con más de tres años de experiencia y una sólida trayectoria en soporte técnico y automatización\r\nempresarial. Especializado en el diagnóstico de hardware y en la implementación de soluciones de software para\r\noptimizar la eficiencia operativa. Poseo un dominio avanzado de herramientas como Django, SQL, n8n y la gestión de APIs.\r\nCuento con un nivel de inglés (7/9) y me destaco por mis aptitudes en adaptabilidad, resolución de problemas, capacidad\r\nde autoaprendizaje y trabajo en equipo, siempre enfocado en la mejora continua.","image_url":"https://1000.masterslogic.com/media/perfil/splash_bLWDIpZ.png","skills":["Python","JavaScript","Dart","C#","Django","Flask","Vue.js","Flutter","HTML/CSS","MySQL","SQLite3","PostgreSQL","Docker","VirtualBox","Cisco Packet Tracer","TensorFlow","Rasa","CrewAI","n8n","Odoo","SAP API"]}'::jsonb);
insert into site_config (key,value) values ('contact', '{"title":"Contacto","subtitle":"¿Tienes un proyecto en mente? Hablemos.","email":"benjaminvelazco.01@gmail.com","social":{"github":"https://github.com/BenjiVZ","linkedin":"https://www.linkedin.com/in/benjivz/","twitter":""}}'::jsonb);
insert into site_config (key,value) values ('footer', '{"copyright":"© 2026 Benjamin Velazco - Portafolio. Todos los derechos reservados.","tagline":"Portafolio profesional de Benjamin Velazco, Técnico Superior en Informática especializado en desarrollo web y móvil con Python, Django, Flutter y tecnologías de IA."}'::jsonb);
