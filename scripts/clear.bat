@echo off
echo Очистка проекта...
cd %~dp0..
:: Удаляем виртуальное окружение
if exist .o (
    echo Удаляем папку .o ...
    rmdir /s /q .o
)

:: Удаляем все __pycache__ рекурсивно
echo Удаляем папки __pycache__ ...
for /d /r %%d in (__pycache__) do (
    if exist "%%d" rmdir /s /q "%%d"
)
:: Удаляем все __pycache__ рекурсивно
echo Удаляем папки alembic ...
for /d /r %%d in (alembic) do (
    if exist "%%d" rmdir /s /q "%%d"
)

:: Удаляем файл базы данных
if exist resort.db (
    echo Удаляем resort.db ...
    del /f /q resort.db
)

pause