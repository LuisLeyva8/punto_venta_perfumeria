@echo off
cd /d %~dp0
echo Generando zip de la carpeta del proyecto...
powershell -Command "Compress-Archive -Path punto_venta_perfumeria -DestinationPath punto_venta_perfumeria_instalable.zip -Force"
echo Listo. Archivo generado: punto_venta_perfumeria_instalable.zip
pause
