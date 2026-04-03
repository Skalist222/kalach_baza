@echo off
set PID_FILE=service.pid

if not exist %PID_FILE% (
    echo PID файл не найден. Сервис не запущен?
    exit /b 1
)

set /p PID=<%PID_FILE%

echo Останавливаем процесс с PID=%PID%...

taskkill /PID %PID% /F

del %PID_FILE%

echo Сервис остановлен.