#!/bin/bash

# Остановить выполнение при ошибке
set -e

cd ..

echo "Создаём виртуальное окружение..."
python3 -m venv .o

echo "Активируем виртуальное окружение..."
source .o/bin/activate

echo "Устанавливаем зависимости..."
pip install --upgrade pip
pip install -r pip.txt

alembic init -t async alembic

echo "Инициализация завершена"
