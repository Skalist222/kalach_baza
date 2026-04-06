@echo off
chcp 65001 > nul
cd %~dp0..


echo "Создаём виртуальное окружение..."
python -m venv .o

echo "Активируем виртуальное окружение..."
call .o\Scripts\activate

echo "Устанавливаем зависимости..."
python -m pip install --upgrade pip
pip install -r "%~dp0/pip.txt"


echo "Инициализация завершена"