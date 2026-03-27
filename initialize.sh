#!/bin/bash

# Остановить выполнение при ошибке
set -e

echo "Создаём виртуальное окружение..."
python3 -m venv .o

echo "Активируем виртуальное окружение..."
source .o/bin/activate

echo "Устанавливаем зависимости..."
pip install --upgrade pip
pip install -r pip.txt

echo "Запускаем сервер..."
uvicorn server:app --port 5555 --reload