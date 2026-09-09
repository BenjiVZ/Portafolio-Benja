// ============================================
// Logo de cada tecnologia. Fuente principal: Simple Icons (un solo estilo,
// color de marca por defecto). Devicon para las pocas que Simple Icons ya no
// tiene. Lo que no tenga logo devuelve null y el componente pinta un icono
// generico: mejor eso que un logo equivocado.
// ============================================

const SIMPLE = 'https://cdn.simpleicons.org'
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

// nombre normalizado -> slug de Simple Icons
const SIMPLE_SLUGS = {
  python: 'python',
  django: 'django',
  'django rest framework': 'django',
  'django rest api': 'django',
  drf: 'django',
  flask: 'flask',
  fastapi: 'fastapi',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  mysql: 'mysql',
  sqlite: 'sqlite',
  sqlite3: 'sqlite',
  redis: 'redis',
  mongodb: 'mongodb',
  supabase: 'supabase',
  firebase: 'firebase',
  dart: 'dart',
  flutter: 'flutter',
  provider: 'flutter',
  'material design': 'materialdesign',
  javascript: 'javascript',
  typescript: 'typescript',
  'vue.js': 'vuedotjs',
  vue: 'vuedotjs',
  vuejs: 'vuedotjs',
  react: 'react',
  'node.js': 'nodedotjs',
  nodejs: 'nodedotjs',
  electron: 'electron',
  html: 'html5',
  html5: 'html5',
  css: 'css',
  css3: 'css',
  'html/css': 'html5',
  bootstrap: 'bootstrap',
  tailwind: 'tailwindcss',
  'chart.js': 'chartdotjs',
  chartjs: 'chartdotjs',
  jwt: 'jsonwebtokens',
  docker: 'docker',
  'docker compose': 'docker',
  linux: 'linux',
  git: 'git',
  github: 'github',
  'git/github': 'github',
  vercel: 'vercel',
  cloudflare: 'cloudflare',
  celery: 'celery',
  pandas: 'pandas',
  numpy: 'numpy',
  opencv: 'opencv',
  tensorflow: 'tensorflow',
  rasa: 'rasa',
  scrapy: 'scrapy',
  jupyter: 'jupyter',
  'google colab': 'googlecolab',
  'google idx': 'google',
  analytics: 'googleanalytics',
  'geolocation api': 'googlemaps',
  'whatsapp api': 'whatsapp',
  whatsapp: 'whatsapp',
  asterisk: 'asterisk',
  sap: 'sap',
  'sap api': 'sap',
  odoo: 'odoo',
  n8n: 'n8n',
  crewai: 'crewai',
  qt: 'qt',
  pyqt5: 'qt',
  pyqt: 'qt',
  pygame: 'python',
  tkinter: 'python',
  matplotlib: 'python',
  cisco: 'cisco',
  'cisco packet tracer': 'cisco',
  virtualbox: 'virtualbox',
  anaconda: 'anaconda',
  php: 'php',
  gemini: 'googlegemini',
  'google gemini': 'googlegemini',
  'google maps': 'googlemaps',
  nginx: 'nginx',
  vite: 'vite',
  'next.js': 'nextdotjs',
  nextjs: 'nextdotjs',
  binance: 'binance',
  'binance api': 'binance',
  perl: 'perl',
  apache: 'apache',
  scss: 'sass',
  sass: 'sass',
  plotly: 'plotly',
  postcss: 'postcss',
  vercel: 'vercel'
}

// Los que Simple Icons retiro y Devicon si tiene
const DEVICON_FILES = {
  'c#': 'csharp/csharp-original.svg',
  csharp: 'csharp/csharp-original.svg',
  'sql server': 'microsoftsqlserver/microsoftsqlserver-plain.svg',
  java: 'java/java-original.svg'
}

function norm(name) {
  return String(name || '').trim().toLowerCase()
}

/**
 * URL del logo o null si no hay uno fiable.
 * @param {string} name   nombre tal como viene en tech_stack
 * @param {string} [color] hex sin # para forzar un color plano (solo Simple Icons)
 */
export function getTechIcon(name, color) {
  const n = norm(name)
  if (SIMPLE_SLUGS[n]) {
    return color ? `${SIMPLE}/${SIMPLE_SLUGS[n]}/${color}` : `${SIMPLE}/${SIMPLE_SLUGS[n]}`
  }
  if (DEVICON_FILES[n]) return `${DEVICON}/${DEVICON_FILES[n]}`
  return null
}

export function hasTechIcon(name) {
  const n = norm(name)
  return Boolean(SIMPLE_SLUGS[n] || DEVICON_FILES[n])
}
