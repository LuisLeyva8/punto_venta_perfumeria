@echo off
echo === Iniciando Punto de Venta ===
cd /d C:\PuntoVentaLocal\punto_venta_perfumeria
start cmd /k "docker-compose up"
timeout /t 10 >nul
start http://localhost:5000
