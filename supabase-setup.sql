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
-- Proyectos: los sistemas sacados de GitHub (src/data/proyectos.json), regenerado 2026-09-09
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('VA-Bus - Reservas de pasajes para Aerorutas','Sistema completo de reservas de pasajes para Aerorutas (Venezuela). El backend en Django REST Framework gestiona viajes, buses, rutas y distribución de asientos, reservas con selección de puesto, pagos con comprobantes y usuarios con autenticación JWT y Google OAuth; incluye un módulo de integración con APIs externas y un backoffice. El frontend es una SPA en React + Vite con capa de servicios y contexto de autenticación. Preparado para producción con SQL Server, Nginx y servicio systemd, con guía de despliegue en DigitalOcean.','Plataforma web de venta y reserva de boletos de autobús para la empresa Aerorutas.','personal','web',ARRAY['Python','Django','Django REST Framework','React','JavaScript','SQL Server','Nginx'],ARRAY['JWT','Google OAuth','Vite','DigitalOcean'],'','',false,false,'',1);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Autobus - Gestión de flota, rutas y pagos','Sistema de gestión de autobuses con registro de flota y operadores, rutas trazadas en Google Maps y descritas por escrito, paradas georreferenciadas, sectores y tarifas por ruta o por tramo origen-destino. Incluye billetera con pago automático y una capa de pagos desacoplada, con proveedor abstracto listo para conectar la integración bancaria. Backend en Django 5.2 + DRF con documentación OpenAPI y app móvil en Flutter con login, rutas, mapa, tarifas y pago. La cercanía entre paradas se calcula con Haversine sin depender de PostGIS.','Backend Django y app Flutter para operadores de transporte: flota, rutas en mapa, tarifas y billetera.','personal','app',ARRAY['Python','Django','Django REST Framework','Flutter','Dart','Google Maps'],ARRAY['OpenAPI','SQLite'],'','',false,false,'',2);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Damasco IA - Asistente Gemini conectado a SAP Business One','Asistente virtual desarrollado en Django que integra Google Gemini (API Key o Vertex AI) con el Service Layer de SAP Business One. Interpreta peticiones en lenguaje natural, construye la consulta OData adecuada mediante function calling y responde con artículos, socios de negocio, pedidos, facturas, almacenes o listas de precios. Guarda el historial de conversaciones, expone endpoints REST y cuenta con panel de administración y guías de configuración.','Chat con Gemini que consulta SAP Business One en lenguaje natural.','work','backend',ARRAY['Python','Django','Gemini','SAP'],ARRAY['Vertex AI','OData','REST'],'','',false,false,'',3);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Damasco Monitor - Tasas de cambio','Sistema Django que consulta periódicamente las tasas de USD y EUR (DolarVzla) y el mercado P2P de Binance (USDT/VES) en horarios programados, guarda solo las variaciones y mantiene el historial completo. Incluye dashboard web con gráficas comparativas en tiempo real, filtros de consulta, panel de administración, comandos de gestión para correr los monitores y guía para ejecutarlo como servicio de Windows.','Monitor automático de USD, EUR y Binance P2P con dashboard de gráficas.','work','backend',ARRAY['Python','Django','Chart.js','Binance API'],ARRAY['Servicios de Windows','SQLite'],'','',false,false,'',4);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('ADD - Sistema de Distribución y Normalización','Herramienta interna que recibe archivos Excel de planificación y de salidas de mercancía, los normaliza contra maestros de centros de distribución (CEDIS), sucursales, regiones y gerentes regionales, y detecta productos faltantes, incidencias de PVP y errores de origen para resolverlos desde la web. Incluye biblioteca de maestros, mapeo por ID, tablero normalizado y decenas de scripts de análisis, verificación y corrección de datos, con documentación del proceso.','Sistema Django para cargar, normalizar y auditar planificaciones de distribución entre CEDIS y sucursales.','work','web',ARRAY['Python','Django','Pandas','Excel'],ARRAY['openpyxl','SQLite'],'','',false,false,'',5);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Frontend BVC - Panel de la Bolsa de Valores de Caracas','Interfaz web para seguir el mercado de la Bolsa de Valores de Caracas: cinta de cotizaciones, tarjetas de resumen, tabla de acciones con mini gráficas, histórico por símbolo de los últimos 30 días, evolución del dólar, cuadrícula de predicciones y analítica de récords. Consume una API propia mediante hooks reutilizables, soporta tema claro y oscuro y se despliega en Vercel.','Dashboard bursátil en React con cotizaciones, gráficas, dólar y predicciones.','web','',ARRAY['React','JavaScript','Vite','Chart.js'],ARRAY['Vercel','REST'],'','',false,false,'',6);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Ivoo Ventas (RV) - App de apoyo comercial','Aplicación móvil para el equipo de ventas de Ivoo. Permite registrar las facturas del día desde un formulario, generar el reporte diario y consultar el historial, administrar la cartera de clientes y solicitar acceso o registrarse como usuario. Incluye herramientas de apoyo: conversor de moneda, calculadora de descuentos y calculadora de cuotas Cashea. Construida con Flutter y Provider, con servicios de autenticación y base de datos.','App Flutter para el equipo de ventas: facturas, clientes, reporte diario y herramientas de cálculo.','app','',ARRAY['Flutter','Dart','Provider'],ARRAY['SQLite','Material Design'],'','',false,false,'',7);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('SINPEL - Gestión técnica e inventario','Plataforma web para SINPEL, servicio técnico de línea blanca y marrón. Registra el ingreso de equipos con datos del cliente, factura, serial, fallas, accesorios y condición; sigue el envío y la recepción con el centro de servicio y controla el inventario de repuestos con importación masiva. Módulos de ingresos, inventario y reportes con panel de administración.','Sistema Django para casos de garantía, servicio técnico e inventario de repuestos.','personal','web',ARRAY['Python','Django','JavaScript','HTML','CSS'],ARRAY['SQLite'],'','',false,false,'',8);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('MenuWeb - Menú digital para restaurantes','Sistema de menú digital para restaurantes. Desde el panel de Django se gestionan categorías (normal, especial, bebidas, postres), platillos con precio, disponibilidad y destacado, ingredientes con imagen, información del local y diseños de fondo. Genera códigos QR para que los clientes abran el menú desde la mesa; el frontend usa HTML, CSS y JavaScript con Tailwind vía PostCSS.','Menú web con código QR administrado desde Django: categorías, platillos, ingredientes y diseños.','web','',ARRAY['Python','Django','HTML','CSS','JavaScript','Tailwind'],ARRAY['Códigos QR','PostCSS'],'','',false,false,'',9);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Lidotel - Fidelización de agencias de viaje','Plataforma de fidelización para un hotel: cada agencia de viajes tiene su cuenta y acumula puntos por las reservas que genera, según tipo de habitación, duración de la estadía y servicios adicionales (transporte, tours, spa), con multiplicadores por temporada alta o último minuto y bonos por volumen de huéspedes. Gestiona reservas con estados (pendiente, confirmada, cancelada, completada), configuración de puntos desde el admin y gráficas con Chart.js sobre Jazzmin.','Sistema Django de puntos para las agencias que reservan en un hotel.','web','',ARRAY['Python','Django','Chart.js','CSS'],ARRAY['Jazzmin','SQLite'],'','',false,false,'',10);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Quigua - Inventario y listas de compra','Aplicación web para el control de inventario de un establecimiento: productos por categoría con unidad, cantidad y stock mínimo, alerta automática de reposición, historial de actualización y listas de compra con ítems, notas y cierre. Panel de administración personalizado (admin_interface, CKEditor, StreamField) y comandos de gestión para la carga de datos.','Sistema web Django para controlar el stock por categorías y generar listas de compra.','web','',ARRAY['Python','Django','JavaScript','CSS'],ARRAY['CKEditor','SQLite'],'','',false,false,'',11);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('App de Stock y Compras para posadas','Aplicación móvil multiplataforma para gestionar el inventario de una posada: categorías, productos con detalle y formulario, registro de uso o consumo de cada producto y lista de compras generada a partir del stock. Incluye tutorial integrado y arquitectura por funcionalidades con Provider. Evoluciona una primera versión (posada_app) con las mismas bases.','App Flutter para el inventario, el consumo de productos y las listas de compra de una posada.','app','',ARRAY['Flutter','Dart','Provider'],ARRAY['Material Design'],'','',false,false,'',12);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Asistente Virtual Turístico de Mérida','Asistente conversacional para turistas de Mérida (Venezuela). El bot en Rasa entiende intenciones como buscar restaurantes, lugares para visitar, actividades al aire libre, museos, compras o vida nocturna, y responde con listados con tipo, dirección y horario. Los datos viven en una API con Django REST Framework (modelos, serializadores y carga inicial) que el bot consulta mediante acciones personalizadas.','Chatbot Rasa con API Django que recomienda restaurantes, lugares y actividades en Mérida.','personal','backend',ARRAY['Python','Rasa','Django','Django REST Framework'],ARRAY['NLU','SQLite'],'','',false,false,'',13);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('AI Asesor en Compras - E-commerce con asistente Rasa','E-commerce en Django (catálogo, carrito y usuarios) acompañado de un asistente Rasa que atiende al comprador: consulta productos y marcas, filtra por nombre, descripción y rango de precios mediante un formulario conversacional y adapta sus respuestas al estado de ánimo del usuario. Incluye un filtro de productos con NLTK y se desarrolló en Google IDX.','Tienda Django con un bot que busca productos, marcas y filtra por precio en conversación.','web','backend',ARRAY['Python','Django','Rasa','HTML','CSS','JavaScript'],ARRAY['NLTK','Google IDX'],'','',false,false,'',14);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Bot Financiero - Asistente de finanzas personales','Asistente conversacional de finanzas personales. En Rasa se definen intenciones para consultar saldo y estado de cuenta, ver el historial de transacciones y registrar gastos mediante un formulario (monto y categoría), con avisos cuando se supera el 80 % del presupuesto mensual. Un proyecto Django persiste los datos y sirve la interfaz; un script levanta ambos servicios a la vez.','Chatbot Rasa con backend Django para consultar saldo, registrar gastos y ver el historial.','backend','',ARRAY['Python','Rasa','Django'],ARRAY['SQLite'],'','',false,false,'',15);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Django Launcher - Lanzador de escritorio para proyectos Django','Utilidad de escritorio en Electron que pide la URL de un repositorio de GitHub, lo clona en una carpeta segura, detecta manage.py, ejecuta el servidor Django y muestra el sistema dentro de la misma ventana. Guarda la configuración de forma persistente, muestra una pantalla de carga en arranques posteriores y detiene el proceso al cerrar. Pensada para entregar sistemas Django a usuarios sin conocimientos técnicos.','App Electron que clona un repositorio de GitHub y ejecuta su servidor Django en una ventana.','app','backend',ARRAY['Electron','JavaScript','Node.js','Python'],ARRAY['simple-git'],'','',false,false,'',16);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('SEAC - Control horario de locales comerciales','Aplicación web en Flask desarrollada durante la pasantía en A.S 28 La Candelaria. Recibe los reportes de control horario de los locales (Candelaria Center y Sambil), ejecuta macros VBA sobre el Excel, limpia y tabula los datos por día con Pandas, calcula aperturas, cierres y excepciones, y muestra resultados y diagnósticos con gráficas Plotly. Exporta a CSV y XLSX y guarda en MySQL.','Herramienta Flask que procesa los Excel de apertura y cierre de tiendas en centros comerciales.','internship','web',ARRAY['Python','Flask','Pandas','Excel','MySQL'],ARRAY['VBA','Plotly','openpyxl'],'','',false,false,'',17);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Implementación de OCS Inventory','Implementación del servidor OCS Inventory NG 2.11 durante la pasantía en A.S 28 La Candelaria (Constructora - Sambil) para inventariar equipos y activos de TI. El repositorio conserva la configuración del servidor (Apache, API y reportes), el respaldo de la base de datos y los comandos de arranque documentados.','Despliegue y configuración de OCS Inventory NG para el control de activos de TI.','internship','sistemas',ARRAY['OCS Inventory','Linux','Apache','MySQL','Perl'],ARRAY['PHP'],'','',false,false,'',18);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Implementación de osTicket','Instalación y personalización de osTicket como mesa de ayuda para las solicitudes de TI en A.S 28 La Candelaria (Constructora - Sambil). Incluye la instancia configurada (osTicket-sambil) y el respaldo de la base de datos de pruebas.','Mesa de ayuda con osTicket para la gestión de solicitudes de TI en Sambil.','internship','sistemas',ARRAY['osTicket','PHP','MySQL'],ARRAY['Apache'],'','',false,false,'',19);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('E-commerce con Django','Plataforma de comercio electrónico en Django organizada en apps: catálogo de productos con imágenes, carrito de compras, usuarios con formularios propios y un módulo de administración con admin-interface. Plantillas y estilos propios por cada app.','Tienda en línea con catálogo, carrito, usuarios y panel de administración.','web','',ARRAY['Python','Django','HTML','CSS'],ARRAY['SQLite'],'','',false,false,'',20);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('E-commerce en Google IDX con filtro inteligente','Evolución del e-commerce en Django construida en el entorno Google IDX (Nix): apps de catálogo, carrito y usuarios con señales, decoradores y estilos SCSS. Incorpora un bot de filtrado de productos que procesa la consulta del usuario con NLTK (tokenización, lematización y stopwords en español) y la traduce en búsquedas sobre la base de datos.','Tienda Django desarrollada en Google IDX con un bot de filtrado de productos por lenguaje natural.','web','',ARRAY['Python','Django','NLTK','SCSS'],ARRAY['Google IDX','Nix'],'','',false,false,'',21);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Lumi Booth - Cabina de fotos web','Aplicación web en React + Vite que convierte la cámara del dispositivo en una cabina de fotos: toma la secuencia de fotos, aplica filtros, permite elegir plantilla (tira o cuadrícula), tema, sticker y leyenda con fecha, y descarga el resultado en PNG o PDF. Todo se procesa en el navegador; las fotos nunca salen del equipo.','Cabina de fotos en el navegador: filtros, plantillas, stickers y descarga en PNG o PDF.','web','',ARRAY['React','JavaScript','Vite','CSS'],ARRAY['Canvas','PDF'],'','',false,false,'',22);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('El cielo que nos vio - Mapa estelar de una fecha','Página de una sola pieza que recuerda un momento mostrando el cielo real que había sobre Valencia, Carabobo, esa noche: el disco estelar se dibuja solo (estrellas, constelaciones trazándose una a una, puntos cardinales) y se puede explorar; incluye contadores en vivo y un fondo con capas de estrellas en parallax y estrellas fugaces. Hecha con React + Vite a partir de un catálogo de estrellas y desplegada como sitio estático.','Página-regalo en React que dibuja el cielo real de un lugar y un instante concretos.','personal','web',ARRAY['React','JavaScript','Vite','CSS'],ARRAY['Canvas','Vercel'],'','',false,false,'',23);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Un date especial - Página interactiva','Página interactiva en Next.js desplegada en Vercel: mural de flores que se abre al tocar, botón que huye del mouse, planificador de cita en tres pasos que genera un mensaje para copiar, página secreta protegida por clave y cierre con confeti y lluvia de corazones. Conserva la versión original en HTML, CSS y JavaScript puro.','Página romántica en Next.js con fases interactivas, clave secreta y confeti.','personal','web',ARRAY['Next.js','React','JavaScript','CSS'],ARRAY['Vercel'],'','',false,false,'',24);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Calculadora de Traslación y Rotación 2D/3D','Proyecto universitario en Jupyter / Google Colab que aplica traslaciones y rotaciones a figuras en dos y tres dimensiones mediante matrices de transformación, mostrando paso a paso los cálculos y la figura resultante con Matplotlib.','Notebook de Google Colab para calcular y graficar transformaciones geométricas.','university','',ARRAY['Python','Jupyter','NumPy','Matplotlib'],ARRAY['Google Colab'],'','',false,false,'',25);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Calculadora con Tkinter','Aplicación de escritorio en Python con interfaz Tkinter que realiza operaciones aritméticas básicas y conversiones entre unidades de longitud (metros, centímetros, milímetros, pies, yardas, millas) y de capacidad (litros, mililitros, galones, cuartos, pintas, onzas).','Calculadora de escritorio con conversión de unidades de longitud y capacidad.','university','app',ARRAY['Python','Tkinter'],'{}','','',false,false,'',26);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Duck''s Dodge - Videojuego con Pygame','Videojuego arcade desarrollado con Pygame: el jugador guía a un pato que debe esquivar objetos que caen del cielo, con velocidad y cantidad crecientes, sistema de puntuación, reinicio rápido y estética retro.','Juego arcade en Python: esquiva los objetos que caen y supera tu récord.','university','app',ARRAY['Python','Pygame'],'{}','','',false,false,'',27);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Mega Cars Wash - Sitio web de autolavado','Página web para el autolavado Mega Cars Wash desarrollada en tres versiones independientes: JavaScript con Firebase (autenticación con Google y Facebook, publicaciones y mensajes), PHP con MySQL y una versión inicial en HTML, CSS y JavaScript. Proyecto de formación temprana en desarrollo web.','Sitio para un autolavado con registro e inicio de sesión, en tres implementaciones.','university','web',ARRAY['HTML','CSS','JavaScript','Firebase','PHP','MySQL'],'{}','','',false,false,'',28);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Sistema de Registro Académico','Sistema web de registro académico desarrollado con PHP y MySQL: alta de estudiantes y profesores, carga de notas y consultas, con interfaz en HTML y CSS y respaldo de la base de datos. Uno de los primeros proyectos de formación.','Registro de estudiantes, profesores y notas con PHP y MySQL.','university','web',ARRAY['PHP','MySQL','HTML','CSS'],'{}','','',false,false,'',29);
insert into projects (title,description,short_description,category,subcategory,tech_stack,sub_skills,live_url,repo_url,featured,hidden,image_url,sort_order) values ('Página Web de Videojuegos','Página web estática sobre videojuegos con varias secciones, galería de imágenes y algo de JavaScript, realizada como práctica de maquetación con HTML y CSS.','Sitio informativo sobre videojuegos maquetado con HTML y CSS.','university','web',ARRAY['HTML','CSS','JavaScript'],'{}','','',false,false,'',30);

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
