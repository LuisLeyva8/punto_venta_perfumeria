@echo off
setlocal
echo === Instalador de Punto de Venta ===

REM Crear carpeta fija
set DESTINO=C:\PuntoVentaLocal
if not exist "%DESTINO%" mkdir "%DESTINO%"

REM Extraer el proyecto ZIP en esa carpeta
echo Extrayendo proyecto...
powershell -Command "Expand-Archive -Path punto_venta_perfumeria.zip -DestinationPath %DESTINO% -Force"

REM Entrar al proyecto
cd /d %DESTINO%\punto_venta_perfumeria

REM Verificar Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker no está instalado. Por favor instala Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b
)

REM Construir e iniciar contenedores
echo Iniciando contenedores con Docker...
docker-compose up --build -d

REM Abrir navegador
timeout /t 5 >nul
start http://localhost:5000

echo === Instalación completa ===
pause
