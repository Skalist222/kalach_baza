#!/bin/bash
set -e

cd "$(dirname "$0")/.." || exit 1

echo "Создаём виртуальное окружение..."
python3 -m venv .o

echo "Устанавливаем зависимости..."
.o/bin/python -m pip install --upgrade pip
.o/bin/pip install -r scripts/pip.txt

echo "Запускаем генерацию..."
.o/bin/python generate_base.py test 1

echo "Инициализация завершена"