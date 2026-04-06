#!/bin/bash
# Переход в родительскую директорию относительно места запуска скрипта
cd "$(dirname "$0")/.." || exit 1

VENV_DIR=".o"
PID_FILE="service.pid"
PORT=5555
HOST="0.0.0.0"

echo "Проверяем, запущен ли сервис..."
if [ -f "$PID_FILE" ]; then
    echo "Сервис уже запущен! (найден файл $PID_FILE)"
    exit 1
fi

echo "Активируем окружение и устанавливаем зависимости..."
# Активация виртуального окружения (если нужно — можно добавить установку pip)
source "$VENV_DIR/bin/activate"

echo "Запускаем сервер в фоне..."
# Запуск uvicorn и сохранение PID
uvicorn server:app --host "$HOST" --port "$PORT" &
PID=$!

echo "$PID" > "$PID_FILE"
echo "Сервер запущен. PID=$PID"