@echo off
chcp 65001 > nul
setlocal
cd %~dp0..

set VENV_DIR=.o
set PID_FILE=service.pid
set PORT=5555
set HOST=0.0.0.0

echo Проверяем запущен ли сервис...
if exist %PID_FILE% (
    echo Сервис уже запущен!
    exit /b 1
)



echo Активируем окружение и ставим зависимости...
call %VENV_DIR%\Scripts\activate



echo Запускаем сервер в фоне...
:: Запуск в фоне + получение PID через powershell
for /f %%i in ('powershell -Command ^
    "$p = Start-Process uvicorn -ArgumentList 'server:app --host %HOST% --port %PORT%' -WindowStyle Hidden -PassThru; $p.Id"') do set PID=%%i

echo %PID% > %PID_FILE%

echo Сервер запущен. PID=%PID%