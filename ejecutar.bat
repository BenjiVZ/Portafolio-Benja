@echo off
title Portafolio Benja - Servidor de desarrollo
cd /d "%~dp0"

REM Instalar dependencias si no existen
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo Error al instalar dependencias.
        pause
        exit /b 1
    )
)

echo Iniciando servidor de desarrollo...
call npm run dev

pause
