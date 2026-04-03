@echo off
chcp 1150

setlocal

set VENV_DIR=.o
set PID_FILE=service.pid


echo Проверяем запущен ли сервис...
if exist %PID_FILE% (
    echo Сервис уже запущен!
    exit /b 1
)

echo Создаём виртуальное окружение...
if not exist %VENV_DIR% (
    python -m venv %VENV_DIR%
)

echo Активируем окружение и ставим зависимости...
call %VENV_DIR%\Scripts\activate

python -m pip install --upgrade pip
pip install -r pip.txt

echo Запускаем сервер в фоне...

:: Запуск в фоне + получение PID через powershell
for /f %%i in ('powershell -Command ^
    "$p = Start-Process uvicorn -ArgumentList 'server:app --host 0.0.0.0 --port 5555 -RedirectStandardOutput out.log -RedirectStandardError err.log' -PassThru; $p.Id"') do set PID=%%i

echo %PID% > %PID_FILE%

echo Сервер запущен. PID=%PID%