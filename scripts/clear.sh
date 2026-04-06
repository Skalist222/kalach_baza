#!/bin/bash
cd ..
echo "Очистка проекта..."

# Удаляем виртуальное окружение
if [ -d ".o" ]; then
    echo "Удаляем папку .o ..."
    rm -rf .o
fi

# Удаляем все __pycache__ рекурсивно
echo "Удаляем папки __pycache__ ..."
find . -type d -name "__pycache__" -exec rm -rf {} +

# Удаляем файл базы данных
if [ -f "resort.db" ]; then
    echo "Удаляем resort.db ..."
    rm -f resort.db
fi

echo "Готово."