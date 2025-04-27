@echo off
echo [🚀] Reseteando Docker Compose...
docker-compose down -v
docker-compose up -d
pause
